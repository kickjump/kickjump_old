import type { StrategyAuthenticateProps } from '../auth/auth-types.js';
import type { StrategyVerifyCallback } from '../auth/strategy.js';
import { ServerError } from '../errors.js';
import { redirect } from '../utils.js';
import type { Email, OAuth2Data, OAuth2StrategyVerifyParams } from './oauth2-strategy.js';
import { type OAuth2Profile, OAuth2Strategy, SESSION_STATE_KEY } from './oauth2-strategy.js';

export class GitHubStrategy extends OAuth2Strategy<GitHubProfile, GitHubExtraParams> {
  override name = 'github';

  private readonly scope: GitHubScope[];
  private readonly allowSignup: boolean;
  private readonly userAgent: string;
  private readonly appName: string | undefined;

  constructor(
    options: GitHubStrategyOptions,
    verify: StrategyVerifyCallback<GitHubStrategyVerifyParams>,
  ) {
    const { clientId, clientSecret, scope, allowSignup, userAgent, appName } = options;
    super(
      {
        clientId,
        clientSecret,
        authorizationUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
      },
      verify,
    );

    this.scope = scope ?? [USER_EMAIL_SCOPE];
    this.allowSignup = allowSignup ?? true;
    this.userAgent = userAgent ?? 'Remix Auth';
    this.appName = appName;
  }

  protected override authorizationParams() {
    return new URLSearchParams({
      scope: this.scope.join(' '),
      allow_signup: String(this.allowSignup),
    });
  }

  protected override async handleCustomAction(event: StrategyAuthenticateProps): Promise<never> {
    const { action, url, session } = event;

    if (action === GITHUB_INSTALL_ACTION) {
      if (!this.appName) {
        throw new ServerError({
          code: 400,
          message: 'Please provide an `appName` when using installations.',
        });
      }

      const state = this.generateState(event);
      const installationUrl = getInstallationUrl({ stateId: state.id, appName: this.appName });
      const response = redirect(installationUrl);

      await session.set(SESSION_STATE_KEY, state);

      // This throws a response which is picked up and returned by the handler.
      throw new ServerError({
        code: 302,
        message: `Redirecting to app installation url ${installationUrl.href}.`,
        response,
      });
    }

    if (action === GITHUB_SETUP_ACTION) {
      const state = await this.verifyState(url, session);

      throw redirect(state.redirect);
    }

    return super.handleCustomAction(event);
  }

  protected async userEmails(accessToken: string): Promise<Email[]> {
    const response = await fetch(USER_EMAILS_URL, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${accessToken}`,
        'User-Agent': this.userAgent,
      },
    });

    const data: GitHubEmailsResponse = await response.json();
    const emails: Email[] = data.map(({ email }) => ({ email }));
    return emails;
  }

  protected override async userProfile(tokens: GitHubOAuth2Data): Promise<GitHubProfile> {
    const response = await fetch(USER_INFO_URL, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${tokens.accessToken}`,
        'User-Agent': this.userAgent,
      },
    });
    const data: GitHubProfile['_json'] = await response.json();
    let emails: GitHubProfile['emails'] = [{ email: data.email }];

    if (this.scope.includes(USER_EMAIL_SCOPE)) {
      emails = await this.userEmails(tokens.accessToken);
    }

    const photos = [{ url: data.avatar_url }];
    const profile: GitHubProfile = {
      provider: 'github',
      displayName: data.login,
      id: data.id.toString(),
      name: data.name,
      emails,
      photos,
      _json: data,
    };

    return profile;
  }

  protected override async getAccessToken(response: Response): Promise<GitHubOAuth2Data> {
    const data = await response.text();
    const params = new URLSearchParams(data);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresIn = params.get('expires_in');
    const refreshTokenExpiresIn = params.get('refresh_token_expires_in');
    const scope = params.get('scope') ?? '';
    const tokenType = params.get('token_type');

    if (!accessToken) {
      throw new ServerError({ code: 'Unauthorized', message: 'Missing access token.' });
    }

    if (!refreshToken) {
      throw new ServerError({ code: 'Unauthorized', message: 'Missing refresh token.' });
    }

    if (!tokenType) {
      throw new ServerError({ code: 'Unauthorized', message: 'Missing token type.' });
    }

    if (!expiresIn || !refreshTokenExpiresIn) {
      throw new ServerError({
        code: 'Unauthorized',
        message: `Missing data: expiresIn: ${expiresIn}, refreshTokenExpiresIn: ${refreshTokenExpiresIn}`,
      });
    }

    return {
      accessToken,
      refreshToken,
      tokenType,
      scope,
      expiresIn: +expiresIn,
      refreshTokenExpiresIn: +refreshTokenExpiresIn,
    };
  }
}

const USER_INFO_URL = 'https://api.github.com/user';
const USER_EMAILS_URL = 'https://api.github.com/user/emails';
const USER_EMAIL_SCOPE = 'user:email';
export const GITHUB_INSTALL_ACTION = 'install';
export const GITHUB_SETUP_ACTION = 'setup';

interface GetInstallationUrlProps {
  stateId: string;
  appName: string;
}

function getInstallationUrl(props: GetInstallationUrlProps): URL {
  const { stateId, appName } = props;
  const url = new URL(`https://github.com/apps/${appName}/installations/new`);
  url.searchParams.set('state', stateId);

  return url;
}

export interface GitHubExtraParams {
  tokenType: string;
  expiresIn: number | undefined;
  refreshTokenExpiresIn: number | undefined;
  scope: string | undefined;
}

type GitHubOAuth2Data = OAuth2Data<GitHubExtraParams>;

export interface GitHubStrategyVerifyParams
  extends OAuth2StrategyVerifyParams<GitHubProfile, GitHubExtraParams> {}
export interface GitHubStrategyOptions {
  clientId: string;
  clientSecret: string;
  /**
   * The app name. Provide this to support installations.
   */
  appName?: string | undefined;
  scope?: GitHubScope[] | undefined;
  allowSignup?: boolean | undefined;
  userAgent?: string | undefined;
}
export type GitHubScope =
  | 'repo'
  | 'repo:status'
  | 'repo_deployment'
  | 'public_repo'
  | 'repo:invite'
  | 'security_events'
  | 'admin:repo_hook'
  | 'write:repo_hook'
  | 'read:repo_hook'
  | 'admin:org'
  | 'write:org'
  | 'read:org'
  | 'admin:public_key'
  | 'write:public_key'
  | 'read:public_key'
  | 'admin:org_hook'
  | 'gist'
  | 'notifications'
  | 'user'
  | 'read:user'
  | 'user:email'
  | 'user:follow'
  | 'delete_repo'
  | 'write:discussion'
  | 'read:discussion'
  | 'write:packages'
  | 'read:packages'
  | 'delete:packages'
  | 'admin:gpg_key'
  | 'write:gpg_key'
  | 'read:gpg_key'
  | 'codespace'
  | 'workflow';

export type GitHubEmailsResponse = Email[];

export interface GitHubProfile extends OAuth2Profile {
  id: string;
  displayName: string;
  name: string;
  _json: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string;
    hireable: boolean;
    bio: string;
    twitter_username: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    private_gists: number;
    total_private_repos: number;
    owned_private_repos: number;
    disk_usage: number;
    collaborators: number;
    two_factor_authentication: boolean;
    plan: {
      name: string;
      space: number;
      private_repos: number;
      collaborators: number;
    };
  };
}

declare global {
  namespace kj {
    interface ClientAuthenticatorUrls {
      github: ['login', 'install'];
    }
  }
}

module default {
  ### Globals

  global currentUser -> uuid;
  global unsafeIgnorePolicies -> bool;

  ### Database Models

  type Account extending CreatedAt, UpdatedAt {
    required property provider -> AccountProvider;
    required property providerAccountId -> str;
    property accessToken -> str;
    property refreshToken -> str;
    property scope -> array<str>;

    # The username for this account.
    property login -> str;

    required link user -> User {
      on target delete delete source;
    }

    index on ((.provider, .providerAccountId));
    constraint exclusive on ((.provider, .providerAccountId));
  }

  type Action extending CreatedAt, Reactable {
    # A string which represents the action
    required property name -> str;

    # The user / organization / team performing  the action.
    required link actor -> Actor;

    # The table that was acted on.
    required link target -> Actionable;

    # An optional description of the new value this can be used in clients to revert to
    # previous versions or describe diffs.
    property data -> json;
  }


  # This is actionable even though the email can't be changed
  # it can be `verified` and can be set to `primary`.
  type Email extending Actionable, CreatedAt, UpdatedAt {
    required property email -> str {
      constraint exclusive;
      readonly := true; # Email's can't be updated
    }

    property verified -> datetime;

    required property primary -> bool {
      default := false;
    }

    required link user -> User {
      on target delete delete source;
    }

    constraint exclusive on ((.user, .primary)) except (not .primary);
    index on (.email);

    # access policy userOwned allow all using (
    #   .user.id ?= global currentUser or global unsafeIgnorePolicies ?= true
    # );
  }

  # Memberships connect actors to entities like projects and proposals.
  type Membership extending Actionable, CreatedAt, UpdatedAt {
    # Each member has an array of permissions represented as a string.
    required property permissions -> array<str>;

    # Link to the user.
    required link actor -> Actor;

    # A link to any entity with support for permissions.
    required link entity -> HasMembership;

    constraint exclusive on ((.actor, .entity));
  }

  type Note extending Actionable, CreatedAt, Reactable, Taggable, UpdatedAt {
    required link creator -> Actor;
    required property message -> str;
  }

  type Organization extending Actor, HasMembership, Actionable {
    required property name -> str {
      constraint exclusive;
      constraint regexp(r'^(?=.{3,39}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])$');
    }

    required property description -> str;
  }

  type Project extending Actionable, CreatedAt, HasMembership, Reactable, Taggable, UpdatedAt {
    required link creator -> Actor {
      # Before a user is deleted all projects should be transferred to the system user.
      on target delete restrict;
    }

    required property name -> str {
      constraint exclusive;
      constraint regexp(r'^(?=.{3,39}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])$');
    }

    required property description -> str;

    multi link proposals := .<project[is Proposal];

    required property status -> Status {
      default := Status.draft;
    }

    required property visibility -> Visibility {
      default := Visibility.owner;
    }
  }

  type Proposal extending Actionable, CreatedAt, HasMembership, Reactable, Taggable, UpdatedAt {
    required link creator -> Actor;

    link project -> Project {
      on target delete restrict;
    }

    required property status -> Status {
      default := Status.draft;
    }

    required property visibility -> Visibility {
      default := Visibility.owner;
    }
  }

  type Reaction extending CreatedAt {
    required property name -> str {
      constraint expression on (
         __subject__ = str_trim(__subject__)
      );
    }

    required link actor -> Actor;
    required link target -> Reactable;

    constraint exclusive on ((.actor, .target, .name));
  }

  type Tag extending CreatedAt {
    required property name -> str {
      constraint exclusive;
      constraint max_len_value(25);
    };

    required multi link tagged -> Taggable;
  }

  # Like a team where everyone is equal.
  type Team extending Actor {}

  type User extending Actor, CreatedAt, UpdatedAt {
    # for now the username is automatically pulled in from GitHub.
    required property username -> str {
      constraint exclusive;
    }

    property name -> str;
    property image -> str;
    multi link emails := .<user[is Email];
    multi link accounts := .<user[is Account];
  }

  ### Abstract Models

  abstract type Actionable {
    multi link actions := .<target[is Action];
  }

  # Eventually will be the base type for organisations, groups and users.
  abstract type Actor {
    multi link memberships := .<actor[is Membership];
    multi link notes := .<creator[is Note];
    multi link projects := .<creator[is Project];
    multi link proposals := .<creator[is Proposal];
  }

  abstract type CreatedAt {
    required property createdAt -> datetime {
      default := std::datetime_current();
      readonly := true;
    };
  }

  abstract type HasMembership {
    # all the permissions attached to this entity.
    multi link members := .<entity[is Membership];
  }

  abstract type Reactable {
    multi link reactions := .<target[is Reaction];
  }

  abstract type Taggable {
    multi link tags := .<tagged[is Tag]
  }

  abstract type UpdatedAt {
    # Currently this must be manually provided by the client as there is no
    # update hook for edgedb. See more here
    # https://github.com/edgedb/edgedb/discussions/3180.
    property updatedAt -> datetime {
      default := std::datetime_current();
    };
  }

  ### Scalars

  # The supported authentication providers.
  scalar type AccountProvider extending enum<github>;

  scalar type Status extending enum<draft, pending, approved>;

  # `creator` only visible to the creator
  # `owners` visible to the owner
  # `admin` visble to all admins
  # `manager` visible to managers
  # `editor` visible to editors
  # `members` visible to all members and the creator
  # `public` visible to everyone
  scalar type Visibility extending enum<owner, admin, manager, editor, member, public>;
}

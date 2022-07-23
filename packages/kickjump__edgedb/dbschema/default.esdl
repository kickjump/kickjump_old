module default {
  type Project extending UpdatedAt, CreatedAt, HasMembership {
    required property title -> str;

    required property slug -> str {
      constraint exclusive;
    }

    required link creator -> User {
      # Before a user is deleted all projects should be transferred to the system user.
      on target delete restrict;
    }

    required property description -> str;

    multi link proposals := .<project[is Proposal];

    required property status -> Status {
      default := Status.draft;
    }

    required property visibility -> Visibility {
      default := Visibility.creator;
    }
  }

  type Proposal extending UpdatedAt, CreatedAt, HasMembership {
    required link creator -> User {
      on target delete restrict;
    }

    link project -> Project {
      on target delete restrict;
    }

    required property status -> Status {
      default := Status.draft;
    }

    required property visibility -> Visibility {
      default := Visibility.creator;
    }
  }

  type Account extending UpdatedAt, CreatedAt {
    required property accountType -> str;
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

  type Organization extending Actor, HasMembership {}

  # Like a team where everyone is equal.
  type Team extending Actor {}

  type User extending UpdatedAt, CreatedAt, Actor {
    required property username -> str {
      constraint exclusive;
    }

    property name -> str;
    property image -> str;
    multi link emails := .<user[is Email];
    multi link accounts := .<user[is Account];
    multi link projects := .<creator[is Project];
    multi link proposals := .<creator[is Proposal];
  }

  type Email extending UpdatedAt, CreatedAt {
    required property email -> str {
      constraint exclusive;
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
  }

  # Memberships connect actors to entities like projects and proposals.
  type Membership extending CreatedAt, UpdatedAt {
    # Each member has an array of permissions represented as a string.
    required property permissions -> array<str>;

    # Link to the user.
    required link actor -> Actor;

    # A link to any entity with support for permissions.
    required link entity -> HasMembership;

    constraint exclusive on ((.actor, .entity));
  }

  type Tag extending CreatedAt {
    required property name -> str {
      constraint exclusive;
    };
    required link taggable -> Taggable;
  }

  # Eventually will be the base type for organisations, groups and users.
  abstract type Actor {
    multi link memberships := .<actor[is Membership];
  }

  abstract type Taggable {
    multi link tags := .<taggable[is Tag]
  }

  abstract type CreatedAt {
    required property createdAt -> datetime {
      default := std::datetime_current();
      readonly := true;
    };
  }

  abstract type UpdatedAt {
    # Currently this must be manually provided by the client as there is no
    # update hook for edgedb. See more here
    # https://github.com/edgedb/edgedb/discussions/3180.
    property updatedAt -> datetime {
      default := std::datetime_current();
    };
  }

  abstract type HasMembership {
    # all the permissions attached to this entity.
    multi link members := .<entity[is Membership];
  }

  scalar type AccountProvider extending enum<github, google, twitter>;
  scalar type Status extending enum<draft, pending, approved>;

  # `creator` only visible to the creator
  # `owners` visible to owners
  # `members` visible to all members and the creator
  # `custom` visible to a custom selection
  # `all` visible to everyone
  scalar type Visibility extending enum<creator, owners, members, custom, everyone>;
}

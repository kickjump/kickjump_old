module default {
  type Project extending UpdatedAt, CreatedAt {
    required property title -> str;
    required property slug -> str {
      constraint exclusive;
    }
    required link creator -> User {
      on target delete restrict;
    }
    required property description -> str;
    multi link proposals := .<project[is Proposal];
    multi link members -> User {
      property permissions -> array<Permission>;
      index on (__subject__@permissions);
    }
    required property status -> Status {
      default := Status.draft;
    }
    required property privacy -> Visibility {
      default := Visibility.creator;
    }
  }

  type Proposal extending UpdatedAt, CreatedAt {
    required link creator -> User {
      on target delete restrict;
    }

    multi link members -> User {
      property permissions -> array<Permission>;
      index on (__subject__@permissions);
    }

    link project -> Project {
      on target delete restrict;
    }

    required property status -> Status {
      default := Status.draft;
    }

    required property privacy -> Visibility {
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

  type User extending UpdatedAt, CreatedAt {
    property name -> str;
    property image -> str;
    multi link emails := .<user[is Email];
    multi link accounts := .<user[is Account];
    multi link createdProjects := .<creator[is Project];
    multi link createdProposals := .<creator[is Proposal];
    multi link maintainedProjects := .<members[is Project];
    multi link contributedProposals := .<members[is Proposal];
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

  scalar type AccountProvider extending enum<github, google>;
  scalar type Status extending enum<draft, pending, approved>;
  scalar type Permission extending enum<
    owner,
    member,
    none,
    updateDescription,
    updateMembers
  >;

  # `creator` only visible to the creator
  # `owners` visible to owners
  # `members` visible to all members and the creator
  # `custom` visible to a custom selection
  # `all` visible to everyone
  scalar type Visibility extending enum<creator, owners, members, custom, all>;
}

module default {
  abstract type CreatedType {
    required property createdAt -> datetime {
      default := std::datetime_current();
      readonly := true;
    };
  }

  abstract type UpdatedType extending CreatedType {
    # Currently this must be manually provided by the client as there is no
    # update hook for edgedb. See more here
    # https://github.com/edgedb/edgedb/discussions/3180.
    property updatedAt -> datetime {
      default := std::datetime_current();
    };
  }

  type Account extending UpdatedType {
    required property accountType -> str;
    required property provider -> str;
    required property providerAccountId -> str;
    property accessToken -> str;
    property refreshToken -> str;
    property scope -> array<str>;

    # The username for this account. Optional.
    property login -> str;

    required link user -> User {
      on target delete delete source;
    }

    index on ((.provider, .providerAccountId));
    constraint exclusive on ((.provider, .providerAccountId));
  }

  type User extending UpdatedType {
    property name -> str;
    property image -> str;
    multi link emails := .<user[is Email];
    multi link accounts := .<user[is Account];
  }

  type Email extending UpdatedType {
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
}

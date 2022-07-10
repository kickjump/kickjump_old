module default {
  abstract type CreatedType {
    required property createdAt -> datetime {
      default := std::datetime_current();
      readonly := true;
      annotation title := 'Created At';
      annotation description := 'The time the object was created.';
    };
  }

  abstract type CreatedUpdatedType extending CreatedType {
    required property updatedAt -> datetime {
      default := std::datetime_current();
      annotation title := 'Updated At';
      annotation description :=
        'The time the object was last updated.
        Currently this must be manually provided by the client as there is no
        update hook for edgedb.

        See more here https://github.com/edgedb/edgedb/discussions/3180.';
    };
  }

  type Account extending CreatedUpdatedType {
    required property userId -> str {
      annotation title := 'User ID';
      annotation description := 'The user\'s ID on the authentication service.';
    }
    required property accountType -> str {
      annotation title := 'Account Type';
      annotation description := 'The type of account.';
    }

    required property provider -> str;
    required property providerAccountid -> str;
    required link user -> User {
      on target delete delete source;
    }
  }

  type User extending CreatedUpdatedType {
    multi link accounts -> Account;
    multi link emails -> Email;
    link email -> Email {
      constraint exclusive;
      annotation description := 'The primary email address for the user.';
    }
  }

  type Email extending CreatedType {
    required property email -> str {
      constraint exclusive;
      annotation title := 'Email';
      annotation description := 'The email address.';
    }

    required property verified -> bool {
      annotation title := 'Verified';
      annotation description := 'Whether the email address has been verified.';
    }

    required property primary -> bool {
      annotation title := 'Primary';
      annotation description := 'Whether the email address is the primary one.';
    }

    required link user -> User {
      on target delete delete source;
    }
  }
}

CREATE MIGRATION m1n3taohobbhfhuaf5flnbhhkznjtqns7qn75udjasiwfqgb3nad3q
    ONTO initial
{
  CREATE ABSTRACT TYPE default::CreatedType {
      CREATE REQUIRED PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
          CREATE ANNOTATION std::description := 'The time the object was created.';
          CREATE ANNOTATION std::title := 'Created At';
      };
  };
  CREATE ABSTRACT TYPE default::CreatedUpdatedType EXTENDING default::CreatedType {
      CREATE REQUIRED PROPERTY updatedAt -> std::datetime {
          SET default := (std::datetime_current());
          CREATE ANNOTATION std::description := 'The time the object was last updated.\n        Currently this must be manually provided by the client as there is no\n        update hook for edgedb.\n\n        See more here https://github.com/edgedb/edgedb/discussions/3180.';
          CREATE ANNOTATION std::title := 'Updated At';
      };
  };
  CREATE TYPE default::Account EXTENDING default::CreatedUpdatedType {
      CREATE REQUIRED PROPERTY accountType -> std::str {
          CREATE ANNOTATION std::description := 'The type of account.';
          CREATE ANNOTATION std::title := 'Account Type';
      };
      CREATE REQUIRED PROPERTY provider -> std::str;
      CREATE REQUIRED PROPERTY providerAccountid -> std::str;
      CREATE REQUIRED PROPERTY userId -> std::str {
          CREATE ANNOTATION std::description := "The user's ID on the authentication service.";
          CREATE ANNOTATION std::title := 'User ID';
      };
  };
  CREATE TYPE default::User EXTENDING default::CreatedUpdatedType {
      CREATE MULTI LINK accounts -> default::Account;
  };
  ALTER TYPE default::Account {
      CREATE REQUIRED LINK user -> default::User {
          ON TARGET DELETE  DELETE SOURCE;
      };
  };
  CREATE TYPE default::Email EXTENDING default::CreatedType {
      CREATE REQUIRED LINK user -> default::User {
          ON TARGET DELETE  DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY email -> std::str {
          CREATE ANNOTATION std::description := 'The email address.';
          CREATE ANNOTATION std::title := 'Email';
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY primary -> std::bool {
          CREATE ANNOTATION std::description := 'Whether the email address is the primary one.';
          CREATE ANNOTATION std::title := 'Primary';
      };
      CREATE REQUIRED PROPERTY verified -> std::bool {
          CREATE ANNOTATION std::description := 'Whether the email address has been verified.';
          CREATE ANNOTATION std::title := 'Verified';
      };
  };
  ALTER TYPE default::User {
      CREATE LINK email -> default::Email {
          CREATE ANNOTATION std::description := 'The primary email address for the user.';
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE MULTI LINK emails -> default::Email;
  };
};

CREATE MIGRATION m1sio4wxcxcvmx7uzn6oeed3s2utczlfrljgt6vjukqfcbktsoxv7q
    ONTO m1n3taohobbhfhuaf5flnbhhkznjtqns7qn75udjasiwfqgb3nad3q
{
  ALTER TYPE default::CreatedUpdatedType RENAME TO default::UpdatedType;
  ALTER TYPE default::Email {
      DROP EXTENDING default::CreatedType;
      EXTENDING default::UpdatedType LAST;
  };
  ALTER TYPE default::Email {
      ALTER PROPERTY primary {
          SET default := false;
          DROP ANNOTATION std::description;
          DROP ANNOTATION std::title;
      };
  };
  ALTER TYPE default::User {
      DROP LINK email;
      ALTER LINK emails {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      CREATE LINK email := (SELECT
          .emails
      FILTER
          (.primary = true)
      );
  };
  ALTER TYPE default::User {
      CREATE PROPERTY image -> std::str;
  };
  ALTER TYPE default::User {
      CREATE PROPERTY name -> std::str;
  };
};

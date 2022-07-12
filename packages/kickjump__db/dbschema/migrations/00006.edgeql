CREATE MIGRATION m1fnhehfarmjop4gjwu7gzjl6e7attga633snff5biptlndk74tr7a
    ONTO m1svspdo2odqhbxysfweh2h3xa5ccsrpo4qrucwbmb44bfvp7x35pa
{
  ALTER TYPE default::Account {
      ALTER PROPERTY accountType {
          DROP ANNOTATION std::description;
          DROP ANNOTATION std::title;
      };
  };
  ALTER TYPE default::UpdatedType {
      ALTER PROPERTY updatedAt {
          RESET OPTIONALITY;
          DROP ANNOTATION std::description;
          DROP ANNOTATION std::title;
      };
  };
  ALTER TYPE default::CreatedType {
      ALTER PROPERTY createdAt {
          DROP ANNOTATION std::description;
          DROP ANNOTATION std::title;
      };
  };
  ALTER TYPE default::Email {
      ALTER PROPERTY email {
          DROP ANNOTATION std::description;
          DROP ANNOTATION std::title;
      };
      ALTER PROPERTY verified {
          DROP ANNOTATION std::description;
          DROP ANNOTATION std::title;
      };
  };
  ALTER TYPE default::Email {
      ALTER PROPERTY verified {
          SET TYPE std::datetime USING (std::datetime_current());
      };
  };
  ALTER TYPE default::User {
      DROP LINK accounts;
      DROP LINK email;
      DROP LINK emails;
  };
};

CREATE MIGRATION m1t7umqkivgxgxnfdqqnvw4cw7illscbz62kjd7f3buo6fw4jq7oaa
    ONTO initial
{
  CREATE ABSTRACT TYPE default::CreatedType {
      CREATE REQUIRED PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
  };
  CREATE ABSTRACT TYPE default::UpdatedType EXTENDING default::CreatedType {
      CREATE PROPERTY updatedAt -> std::datetime {
          SET default := (std::datetime_current());
      };
  };
  CREATE TYPE default::Account EXTENDING default::UpdatedType {
      CREATE REQUIRED PROPERTY provider -> std::str;
      CREATE REQUIRED PROPERTY providerAccountId -> std::str;
      CREATE CONSTRAINT std::exclusive ON ((.provider, .providerAccountId));
      CREATE INDEX ON ((.provider, .providerAccountId));
      CREATE PROPERTY accessToken -> std::str;
      CREATE REQUIRED PROPERTY accountType -> std::str;
      CREATE PROPERTY refreshToken -> std::str;
      CREATE PROPERTY scope -> array<std::str>;
  };
  CREATE TYPE default::User EXTENDING default::UpdatedType {
      CREATE PROPERTY image -> std::str;
      CREATE PROPERTY name -> std::str;
  };
  ALTER TYPE default::Account {
      CREATE REQUIRED LINK user -> default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK accounts := (.<user[IS default::Account]);
  };
  CREATE TYPE default::Email EXTENDING default::UpdatedType {
      CREATE REQUIRED LINK user -> default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY primary -> std::bool {
          SET default := false;
      };
      CREATE CONSTRAINT std::exclusive ON ((.user, .primary)) EXCEPT (NOT (.primary));
      CREATE REQUIRED PROPERTY email -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.email);
      CREATE PROPERTY verified -> std::datetime;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK emails := (.<user[IS default::Email]);
  };
};

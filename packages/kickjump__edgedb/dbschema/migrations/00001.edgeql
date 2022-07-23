CREATE MIGRATION m1h6jxxh44vfjldruxeto32v4nibxbou573yhmiegbcfectgne5yuq
    ONTO initial
{
  CREATE ABSTRACT TYPE default::CreatedAt {
      CREATE REQUIRED PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
  };
  CREATE ABSTRACT TYPE default::UpdatedAt {
      CREATE PROPERTY updatedAt -> std::datetime {
          SET default := (std::datetime_current());
      };
  };
  CREATE SCALAR TYPE default::AccountProvider EXTENDING enum<github, google, twitter>;
  CREATE TYPE default::Account EXTENDING default::UpdatedAt, default::CreatedAt {
      CREATE REQUIRED PROPERTY provider -> default::AccountProvider;
      CREATE REQUIRED PROPERTY providerAccountId -> std::str;
      CREATE CONSTRAINT std::exclusive ON ((.provider, .providerAccountId));
      CREATE INDEX ON ((.provider, .providerAccountId));
      CREATE PROPERTY accessToken -> std::str;
      CREATE REQUIRED PROPERTY accountType -> std::str;
      CREATE PROPERTY login -> std::str;
      CREATE PROPERTY refreshToken -> std::str;
      CREATE PROPERTY scope -> array<std::str>;
  };
  CREATE ABSTRACT TYPE default::Actor;
  CREATE TYPE default::User EXTENDING default::UpdatedAt, default::CreatedAt, default::Actor {
      CREATE PROPERTY image -> std::str;
      CREATE PROPERTY name -> std::str;
      CREATE REQUIRED PROPERTY username -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::Account {
      CREATE REQUIRED LINK user -> default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK accounts := (.<user[IS default::Account]);
  };
  CREATE ABSTRACT TYPE default::HasMembership;
  CREATE TYPE default::Membership EXTENDING default::CreatedAt, default::UpdatedAt {
      CREATE REQUIRED LINK actor -> default::Actor;
      CREATE REQUIRED LINK entity -> default::HasMembership;
      CREATE REQUIRED PROPERTY permissions -> array<std::str>;
  };
  ALTER TYPE default::Actor {
      CREATE MULTI LINK memberships := (.<actor[IS default::Membership]);
  };
  ALTER TYPE default::HasMembership {
      CREATE MULTI LINK members := (.<entity[IS default::Membership]);
  };
  CREATE TYPE default::Organization EXTENDING default::Actor, default::HasMembership;
  CREATE TYPE default::Team EXTENDING default::Actor;
  CREATE TYPE default::Email EXTENDING default::UpdatedAt, default::CreatedAt {
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
  CREATE SCALAR TYPE default::Status EXTENDING enum<draft, pending, approved>;
  CREATE SCALAR TYPE default::Visibility EXTENDING enum<creator, owners, members, custom, everyone>;
  CREATE TYPE default::Project EXTENDING default::UpdatedAt, default::CreatedAt, default::HasMembership {
      CREATE REQUIRED LINK creator -> default::User {
          ON TARGET DELETE RESTRICT;
      };
      CREATE REQUIRED PROPERTY description -> std::str;
      CREATE REQUIRED PROPERTY slug -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY status -> default::Status {
          SET default := (default::Status.draft);
      };
      CREATE REQUIRED PROPERTY title -> std::str;
      CREATE REQUIRED PROPERTY visibility -> default::Visibility {
          SET default := (default::Visibility.creator);
      };
  };
  CREATE TYPE default::Proposal EXTENDING default::UpdatedAt, default::CreatedAt, default::HasMembership {
      CREATE LINK project -> default::Project {
          ON TARGET DELETE RESTRICT;
      };
      CREATE REQUIRED LINK creator -> default::User {
          ON TARGET DELETE RESTRICT;
      };
      CREATE REQUIRED PROPERTY status -> default::Status {
          SET default := (default::Status.draft);
      };
      CREATE REQUIRED PROPERTY visibility -> default::Visibility {
          SET default := (default::Visibility.creator);
      };
  };
  CREATE TYPE default::Tag EXTENDING default::CreatedAt {
      CREATE REQUIRED PROPERTY name -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK emails := (.<user[IS default::Email]);
      CREATE MULTI LINK projects := (.<creator[IS default::Project]);
      CREATE MULTI LINK proposals := (.<creator[IS default::Proposal]);
  };
  ALTER TYPE default::Project {
      CREATE MULTI LINK proposals := (.<project[IS default::Proposal]);
  };
  CREATE ABSTRACT TYPE default::Taggable;
  ALTER TYPE default::Tag {
      CREATE REQUIRED LINK taggable -> default::Taggable;
  };
  ALTER TYPE default::Taggable {
      CREATE MULTI LINK tags := (.<taggable[IS default::Tag]);
  };
};

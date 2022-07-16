CREATE MIGRATION m1doc5kf3dckrfwoq2vzgxjchluz6gr2hmkshyxpj2koc2qdrei5hq
    ONTO initial
{
  CREATE SCALAR TYPE default::ProjectPermission EXTENDING enum<owner, member, none, updateDescription, updateMembers>;
  CREATE ABSTRACT TYPE default::CreatedAt {
      CREATE REQUIRED PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
  };
  CREATE SCALAR TYPE default::ProposalPermission EXTENDING enum<owner, member, none, updateDescription, updateMembers>;
  CREATE ABSTRACT TYPE default::UpdatedAt {
      CREATE PROPERTY updatedAt -> std::datetime {
          SET default := (std::datetime_current());
      };
  };
  CREATE TYPE default::Project EXTENDING default::UpdatedAt, default::CreatedAt {
      CREATE REQUIRED PROPERTY description -> std::str;
      CREATE REQUIRED PROPERTY title -> std::str;
  };
  CREATE TYPE default::User EXTENDING default::UpdatedAt, default::CreatedAt {
      CREATE PROPERTY image -> std::str;
      CREATE PROPERTY name -> std::str;
  };
  ALTER TYPE default::Project {
      CREATE MULTI LINK members -> default::User {
          CREATE PROPERTY permissions -> array<default::ProjectPermission>;
          CREATE INDEX ON (__subject__@permissions);
      };
  };
  CREATE SCALAR TYPE default::ProjectStatus EXTENDING enum<draft, awaitingVerification, completed>;
  CREATE SCALAR TYPE default::ProposalStatus EXTENDING enum<draft, pending, approved>;
  CREATE TYPE default::Proposal EXTENDING default::UpdatedAt, default::CreatedAt {
      CREATE MULTI LINK members -> default::User {
          CREATE PROPERTY permissions -> array<default::ProposalPermission>;
          CREATE INDEX ON (__subject__@permissions);
      };
      CREATE LINK project -> default::Project {
          ON TARGET DELETE RESTRICT;
      };
      CREATE REQUIRED LINK creator -> default::User {
          ON TARGET DELETE RESTRICT;
      };
      CREATE REQUIRED PROPERTY status -> default::ProposalStatus {
          SET default := (default::ProjectStatus.draft);
      };
  };
  CREATE SCALAR TYPE default::AccountProvider EXTENDING enum<github, google>;
  CREATE TYPE default::Account EXTENDING default::UpdatedAt, default::CreatedAt {
      CREATE REQUIRED PROPERTY provider -> default::AccountProvider;
      CREATE REQUIRED PROPERTY providerAccountId -> std::str;
      CREATE CONSTRAINT std::exclusive ON ((.provider, .providerAccountId));
      CREATE INDEX ON ((.provider, .providerAccountId));
      CREATE REQUIRED LINK user -> default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE PROPERTY accessToken -> std::str;
      CREATE REQUIRED PROPERTY accountType -> std::str;
      CREATE PROPERTY login -> std::str;
      CREATE PROPERTY refreshToken -> std::str;
      CREATE PROPERTY scope -> array<std::str>;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK accounts := (.<user[IS default::Account]);
      CREATE MULTI LINK projectsCreated := (.<user[IS default::Account]);
  };
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
  ALTER TYPE default::User {
      CREATE MULTI LINK emails := (.<user[IS default::Email]);
  };
  ALTER TYPE default::Project {
      CREATE MULTI LINK proposals := (.<project[IS default::Proposal]);
  };
  CREATE SCALAR TYPE default::Visibility EXTENDING enum<private, members, public>;
};

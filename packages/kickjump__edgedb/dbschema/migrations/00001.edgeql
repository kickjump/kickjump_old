CREATE MIGRATION m1njxlmajesz366x4nq57e6ps63d5plzslkni7gffcna3apww5sexq
    ONTO initial
{
  CREATE GLOBAL default::currentUser -> std::uuid;
  CREATE GLOBAL default::unsafeIgnorePolicies -> std::bool;
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
  CREATE SCALAR TYPE default::AccountProvider EXTENDING enum<github>;
  CREATE TYPE default::Account EXTENDING default::CreatedAt, default::UpdatedAt {
      CREATE REQUIRED PROPERTY provider -> default::AccountProvider;
      CREATE REQUIRED PROPERTY providerAccountId -> std::str;
      CREATE CONSTRAINT std::exclusive ON ((.provider, .providerAccountId));
      CREATE INDEX ON ((.provider, .providerAccountId));
      CREATE PROPERTY accessToken -> std::str;
      CREATE PROPERTY login -> std::str;
      CREATE PROPERTY refreshToken -> std::str;
      CREATE PROPERTY scope -> array<std::str>;
  };
  CREATE ABSTRACT TYPE default::Actor;
  CREATE TYPE default::User EXTENDING default::Actor, default::CreatedAt, default::UpdatedAt {
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
  CREATE ABSTRACT TYPE default::Reactable;
  CREATE TYPE default::Action EXTENDING default::CreatedAt, default::Reactable {
      CREATE REQUIRED LINK actor -> default::Actor;
      CREATE PROPERTY data -> std::json;
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  CREATE TYPE default::Reaction EXTENDING default::CreatedAt {
      CREATE REQUIRED LINK target -> default::Reactable;
      CREATE REQUIRED LINK actor -> default::Actor;
      CREATE REQUIRED PROPERTY name -> std::str {
          CREATE CONSTRAINT std::expression ON ((__subject__ = std::str_trim(__subject__)));
      };
      CREATE CONSTRAINT std::exclusive ON ((.actor, .target, .name));
  };
  ALTER TYPE default::Reactable {
      CREATE MULTI LINK reactions := (.<target[IS default::Reaction]);
  };
  CREATE ABSTRACT TYPE default::Actionable;
  ALTER TYPE default::Action {
      CREATE REQUIRED LINK target -> default::Actionable;
  };
  ALTER TYPE default::Actionable {
      CREATE MULTI LINK actions := (.<target[IS default::Action]);
  };
  CREATE TYPE default::Email EXTENDING default::Actionable, default::CreatedAt, default::UpdatedAt {
      CREATE REQUIRED LINK user -> default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY primary -> std::bool {
          SET default := false;
      };
      CREATE CONSTRAINT std::exclusive ON ((.user, .primary)) EXCEPT (NOT (.primary));
      CREATE REQUIRED PROPERTY email -> std::str {
          SET readonly := true;
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.email);
      CREATE PROPERTY verified -> std::datetime;
  };
  CREATE TYPE default::Membership EXTENDING default::Actionable, default::CreatedAt, default::UpdatedAt {
      CREATE REQUIRED LINK actor -> default::Actor;
      CREATE REQUIRED PROPERTY permissions -> array<std::str>;
  };
  CREATE SCALAR TYPE default::Status EXTENDING enum<draft, pending, approved>;
  CREATE SCALAR TYPE default::Visibility EXTENDING enum<owner, admin, manager, editor, member, public>;
  CREATE ABSTRACT TYPE default::HasMembership;
  CREATE ABSTRACT TYPE default::Taggable;
  CREATE TYPE default::Proposal EXTENDING default::Actionable, default::CreatedAt, default::HasMembership, default::Reactable, default::Taggable, default::UpdatedAt {
      CREATE REQUIRED LINK creator -> default::Actor;
      CREATE REQUIRED PROPERTY status -> default::Status {
          SET default := (default::Status.draft);
      };
      CREATE REQUIRED PROPERTY visibility -> default::Visibility {
          SET default := (default::Visibility.owner);
      };
  };
  ALTER TYPE default::Actor {
      CREATE MULTI LINK memberships := (.<actor[IS default::Membership]);
  };
  CREATE TYPE default::Tag EXTENDING default::CreatedAt {
      CREATE MULTI LINK tagged -> default::Taggable;
      CREATE REQUIRED PROPERTY name -> std::str {
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::max_len_value(25);
      };
  };
  ALTER TYPE default::Taggable {
      CREATE MULTI LINK tags := (.<tagged[IS default::Tag]);
  };
  CREATE TYPE default::Note EXTENDING default::Actionable, default::CreatedAt, default::Reactable, default::Taggable, default::UpdatedAt {
      CREATE REQUIRED LINK creator -> default::Actor;
      CREATE REQUIRED PROPERTY message -> std::str;
  };
  ALTER TYPE default::Actor {
      CREATE MULTI LINK notes := (.<creator[IS default::Note]);
      CREATE MULTI LINK proposals := (.<creator[IS default::Proposal]);
  };
  ALTER TYPE default::Membership {
      CREATE REQUIRED LINK entity -> default::HasMembership;
      CREATE CONSTRAINT std::exclusive ON ((.actor, .entity));
  };
  ALTER TYPE default::HasMembership {
      CREATE MULTI LINK members := (.<entity[IS default::Membership]);
  };
  CREATE TYPE default::Organization EXTENDING default::Actor, default::HasMembership, default::Actionable {
      CREATE REQUIRED PROPERTY description -> std::str;
      CREATE REQUIRED PROPERTY name -> std::str {
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::regexp('^(?=.{3,39}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])$');
      };
  };
  CREATE TYPE default::Project EXTENDING default::Actionable, default::CreatedAt, default::HasMembership, default::Reactable, default::Taggable, default::UpdatedAt {
      CREATE REQUIRED LINK creator -> default::Actor {
          ON TARGET DELETE RESTRICT;
      };
      CREATE REQUIRED PROPERTY description -> std::str;
      CREATE REQUIRED PROPERTY name -> std::str {
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::regexp('^(?=.{3,39}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])$');
      };
      CREATE REQUIRED PROPERTY status -> default::Status {
          SET default := (default::Status.draft);
      };
      CREATE REQUIRED PROPERTY visibility -> default::Visibility {
          SET default := (default::Visibility.owner);
      };
  };
  ALTER TYPE default::Actor {
      CREATE MULTI LINK projects := (.<creator[IS default::Project]);
  };
  CREATE TYPE default::Team EXTENDING default::Actor;
  ALTER TYPE default::User {
      CREATE MULTI LINK emails := (.<user[IS default::Email]);
  };
  ALTER TYPE default::Proposal {
      CREATE LINK project -> default::Project {
          ON TARGET DELETE RESTRICT;
      };
  };
  ALTER TYPE default::Project {
      CREATE MULTI LINK proposals := (.<project[IS default::Proposal]);
  };
};

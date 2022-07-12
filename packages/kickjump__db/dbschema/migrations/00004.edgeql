CREATE MIGRATION m1d2h7mydln7zzydjcfo6nfd5g4ccibeapzlk2argupmfptmss4eya
    ONTO m1m4m3cb6hbldbdilmk5vpzl35cxs2546kyemitj5bpibxm6u6y3ca
{
  CREATE SCALAR TYPE default::AuthProvider EXTENDING enum<GitHub, Email, SolanaWallet>;
  ALTER TYPE default::Account {
      ALTER PROPERTY provider {
          SET TYPE default::AuthProvider;
      };
      CREATE CONSTRAINT std::exclusive ON ((.provider, .providerAccountId));
      DROP PROPERTY userId;
  };
  ALTER TYPE default::Email {
      CREATE CONSTRAINT std::exclusive ON ((.user, .primary)) EXCEPT (NOT (.primary));
      CREATE INDEX ON (.email);
  };
};

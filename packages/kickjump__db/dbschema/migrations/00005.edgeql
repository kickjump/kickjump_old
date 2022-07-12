CREATE MIGRATION m1svspdo2odqhbxysfweh2h3xa5ccsrpo4qrucwbmb44bfvp7x35pa
    ONTO m1d2h7mydln7zzydjcfo6nfd5g4ccibeapzlk2argupmfptmss4eya
{
  ALTER TYPE default::Account {
      ALTER PROPERTY provider {
          SET TYPE std::str USING (std::str_lower(<std::str>.provider));
      };
  };
  DROP SCALAR TYPE default::AuthProvider;
};

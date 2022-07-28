CREATE MIGRATION m1u54d5xwknuh25cvz3uwkbv33ba24gixu7tscztt2bluzfh5ktn6a
    ONTO m1ffqyzczk5ytcmjvlmdfxwlx7qk6bfsx5dkyuguvaoze2qe455hra
{
  ALTER TYPE default::Reaction {
      ALTER LINK actor {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::Reaction {
      ALTER LINK target {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};

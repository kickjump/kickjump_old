CREATE MIGRATION m1j6m7q6r57mn7hmulvlr2lhhox26mhsbaqjs7wr2hbs5fpb5thtva
    ONTO m1t7umqkivgxgxnfdqqnvw4cw7illscbz62kjd7f3buo6fw4jq7oaa
{
  ALTER TYPE default::Account {
      CREATE PROPERTY login -> std::str;
  };
};

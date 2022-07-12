CREATE MIGRATION m1455r3u26j6ga7tr4lvmouyvjrppflbygcjqqfvtf4za5sdz43zqa
    ONTO m1o4rqohz3e6eddpe5llf4zlxtotraoi3abhtya2xy5ve3wvk5pv3a
{
  ALTER TYPE default::Account {
      CREATE PROPERTY accessToken -> std::str;
      CREATE PROPERTY refreshToken -> std::str;
      CREATE PROPERTY scope -> array<std::str>;
  };
};

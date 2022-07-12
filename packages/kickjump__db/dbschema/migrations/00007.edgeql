CREATE MIGRATION m1o4rqohz3e6eddpe5llf4zlxtotraoi3abhtya2xy5ve3wvk5pv3a
    ONTO m1fnhehfarmjop4gjwu7gzjl6e7attga633snff5biptlndk74tr7a
{
  ALTER TYPE default::User {
      CREATE MULTI LINK accounts := (.<user[IS default::Account]);
      CREATE MULTI LINK emails := (.<user[IS default::Email]);
  };
};

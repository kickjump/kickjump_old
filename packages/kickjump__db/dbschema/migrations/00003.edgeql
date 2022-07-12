CREATE MIGRATION m1m4m3cb6hbldbdilmk5vpzl35cxs2546kyemitj5bpibxm6u6y3ca
    ONTO m1sio4wxcxcvmx7uzn6oeed3s2utczlfrljgt6vjukqfcbktsoxv7q
{
  ALTER TYPE default::Account {
      ALTER PROPERTY providerAccountid {
          RENAME TO providerAccountId;
      };
      CREATE INDEX ON ((.provider, .providerAccountId));
  };
};

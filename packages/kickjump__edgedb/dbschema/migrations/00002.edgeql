CREATE MIGRATION m1r42stwwt4ry66ghmubb2wv2gcb6b4yxuijsbppmzuepaxnr4z2sq
    ONTO m1h6jxxh44vfjldruxeto32v4nibxbou573yhmiegbcfectgne5yuq
{
  ALTER TYPE default::Membership {
      CREATE CONSTRAINT std::exclusive ON ((.actor, .entity));
  };
};

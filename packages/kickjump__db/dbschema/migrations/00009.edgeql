CREATE MIGRATION m1pkqbqvxgjy4fvdaqc6n33anurefomdcqdv7qlnpn5nxt35yo7e2a
    ONTO m1455r3u26j6ga7tr4lvmouyvjrppflbygcjqqfvtf4za5sdz43zqa
{
  ALTER TYPE default::Email {
      ALTER PROPERTY verified {
          RESET OPTIONALITY;
      };
  };
};

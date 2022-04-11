import { Link } from '@remix-run/react';

import { useOptionalUser } from '~/hooks/use-optional-user';

export default function Index() {
  const user = useOptionalUser();

  return <div>This is the app</div>;
}

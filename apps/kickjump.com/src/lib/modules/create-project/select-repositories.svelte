<script lang="ts" context="module">
  import { trpc } from '@kickjump/trpc/client';

  import { Skeleton } from '$components/loaders';

  // import VirtualList from 'svelte-tiny-virtual-list';
</script>

<script lang="ts">
  const query = trpc.github.repos.infinite(
    { perPage: 20 },
    { getNextPageParam: (lastPage) => lastPage.next?.page },
  );

  export let loadingSkeletonCount = 10;

  $: console.log($query.data);
</script>

<!-- <VirtualList /> -->
<div class="overflow-x-auto w-full max-h-96">
  <table class="table w-full">
    <!-- head -->
    <thead>
      <tr>
        <th>
          <label>
            <input type="checkbox" class="checkbox" />
          </label>
        </th>
        <th>Name</th>
        <th>Job</th>
        <th>Favorite Color</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <!-- row 1 -->
      <tr>
        <th>
          <label>
            <input type="checkbox" class="checkbox" />
          </label>
        </th>
        <td>
          <div class="flex items-center space-x-3">
            <div class="avatar">
              <div class="mask mask-squircle w-12 h-12">
                <img
                  src="/tailwind-css-component-profile-2@56w.png"
                  alt="Avatar Tailwind CSS Component"
                />
              </div>
            </div>
            <div>
              <div class="font-bold">Hart Hagerty</div>
              <div class="text-sm opacity-50">United States</div>
            </div>
          </div>
        </td>
        <td>
          Zemlak, Daniel and Leannon
          <br />
          <span class="badge badge-ghost badge-sm">Desktop Support Technician</span>
        </td>
        <td>Purple</td>
        <th>
          <button class="btn btn-ghost btn-xs">details</button>
        </th>
      </tr>
      {#if $query.isLoading}
        {#each { length: loadingSkeletonCount } as _}
          <tr>
            <th>
              <Skeleton height={50} width="100%">
                <rect width="25" height="25" x="0" y="0" rx="12" ry="12" />
              </Skeleton>
            </th>
            <td>
              <Skeleton height={50} width="100%">
                <rect width="25" height="25" x="0" y="0" rx="12" ry="12" />
              </Skeleton>
            </td>
            <td>
              <Skeleton height={50} width="100%">
                <rect width="25" height="25" x="0" y="0" rx="12" ry="12" />
              </Skeleton>
            </td>
            <th>
              <Skeleton height={50} width="100%">
                <rect width="25" height="25" x="0" y="0" rx="12" ry="12" />
              </Skeleton>
            </th>
          </tr>
        {/each}
      {/if}
    </tbody>
    <thead>
      <tr>
        <th>
          <label>
            <input type="checkbox" class="checkbox" />
          </label>
        </th>
        <th>Name</th>
        <th>Job</th>
        <th>Favorite Color</th>
        <th />
      </tr>
    </thead>
  </table>
</div>

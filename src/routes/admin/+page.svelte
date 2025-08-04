<script lang="ts">
  import type { PageProps } from "./$types";
  import InputField from "$lib/form-components/input-field.svelte";

  let { data }: PageProps = $props();
  let { session, rows, total, currentPage, search } = data;

  let userName = session.user?.name;

  const pageCount = Math.ceil(total / 20);

  function updateSearch(event: SubmitEvent) {
    event.preventDefault();
    const form = new FormData(event.target as HTMLFormElement);
    const query = form.get("search")?.toString();
    if (query) {
      window.location.href = `?search=${encodeURIComponent(query)}&page=1`;
    }
  }

  function goToPage(p: number) {
    const params = new URLSearchParams(location.search);
    params.set("page", p.toString());
    window.location.href = `?${params.toString()}`;
  }
</script>

<div class="container-row">
  <div class="container bar">
    <span>
      {userName}
    </span>
    <form onsubmit={updateSearch} style="margin-left: auto;">
      <InputField label="" id="search" />
      <button class="btn btn-primary">Search</button>
    </form>
  </div>
</div>

{#if rows}
  <div class="container">
    <table>
      <thead>
        <tr>
          <th>Redeemed</th>
          <th>Date submitted</th>
          <th>Code</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as row}
          <tr>
            <td>Checkbox</td>
            <td>{row.date}</td>
            <td>{row.code}</td>
            <td>{row.first_name}</td>
            <td>{row.last_name}</td>
            <td>{row.email}</td>
            <td>{row.phone}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

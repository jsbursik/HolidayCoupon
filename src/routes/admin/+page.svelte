<script lang="ts">
  import type { PageProps } from "./$types";
  import Input from "$lib/form-components/input.svelte";
  import Switch from "$lib/form-components/switch.svelte";
  import Paginator from "$lib/paginator/paginator.svelte";
  import { showError, showSuccess } from "$lib/toast/toastStore";

  let { data }: PageProps = $props();
  let { session, rows, total, currentPage, search, hasMore } = data;

  let userName = session.user?.name;

  // Only calculate pageCount if we have total, otherwise use hasMore for navigation
  const pageCount = total ? Math.ceil(total / 20) : (hasMore ? currentPage + 1 : currentPage);

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

  async function toggleCoupon(redeemed: boolean, id: string | number) {
    const couponId = typeof id === "string" ? parseInt(id) : id;

    const res = await fetch("/api/redemption", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: couponId, redeemed }),
    });

    if (!res.ok) {
      showError("Failed to update coupon status");
      return false;
    }

    showSuccess(`Coupon ${redeemed ? "redeemed" : "unredeemed"} successfully!`);
    return true;
  }

  function formatPhone(phone: string) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }
</script>

<div class="container-row">
  <div class="container bar">
    <span class="username">
      {userName}
    </span>
    <form onsubmit={updateSearch} style="">
      <Input label="" id="search" placeholder="Search..." />
      <button class="btn btn-primary">Find</button>
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
            <td>
              <Switch label="" id={row.id} onToggle={toggleCoupon} checked={row.redeemed} />
            </td>
            <td>{row.date}</td>
            <td>{row.code}</td>
            <td>{row.first_name}</td>
            <td>{row.last_name}</td>
            <td>{row.email}</td>
            <td>{formatPhone(row.phone)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

{#if pageCount > 1 || hasMore}
  <Paginator curr={currentPage} last={pageCount} onPageClick={goToPage} />
{/if}

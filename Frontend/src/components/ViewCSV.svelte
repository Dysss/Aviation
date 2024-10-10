<script>
	import { onMount } from "svelte";
    import { axiosInstance } from "../axios";
	import LoadingSpinner from "./LoadingSpinner.svelte";
    import { newUpload } from "../stores/upload";

    let data = [];
    let page = 1;
    let search = '';
    let loading = false;

    async function fetchData () {
        loading = true;
        try {
            const response = await axiosInstance.get('/api/getData', {
                params: {
                    page: page,
                    search: search
                }
            })

            if (response.status !== 200) {
                console.log(response.status);
                return alert("Failed to fetch data!")
            }

            data = response.data;
            newUpload.set(false);
        } catch (err) {
            console.log(err)
            alert("Failed to fetch data!")
        } finally {
            loading = false;
        }
    }

    function changePage (change) {
        page += change
        fetchData();
    }

    function handleSearch (event) {
        search = event.target.value;
        page = 1;
        fetchData();
    }

    $: if ($newUpload) {
        fetchData()
    }

    // onMount(fetchData)
</script>

<h1>View CSV data</h1>

<div class="search-container">
    <input type="text" placeholder="Search..." on:input={handleSearch}>

    <div class="spinner">
        {#if loading}
            <LoadingSpinner />
        {/if}
    </div>
</div>


<table>
    <thead>
        <tr>
            <th>Post ID</th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Body</th>
        </tr>
    </thead>
    <tbody>
        {#each data as row}
        <tr>
            <td>{row.postId}</td>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>{row.email}</td>
            <td>{row.body}</td>
        </tr>
        {/each}
    </tbody>
</table>

<div>
    <button on:click={() => changePage(-1)} disabled={page ===1}>Previous</button>
    <button on:click={() => changePage(1)}>Next</button>
</div>

<style>
    div {
        margin-top: 10px;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 8px;
    }

    .search-container {
        display: flex;
        align-items: center;
    }

    .spinner {
        position: relative;
        width: 24px;
        height: 24px;
        margin-left: 8px;
        display: flex;
        align-items: center;
    }
</style>
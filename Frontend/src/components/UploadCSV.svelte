<script>
	import { onMount } from "svelte";
    import { axiosInstance } from "../axios";
	import LoadingSpinner from "./LoadingSpinner.svelte";

    let file;
    let loading = false;

    // Upload the file
    async function uploadCSV() {
        if (!file) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        loading = true;

        try {
            const response = await axiosInstance.post('/api/uploadCsv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.status === 200) {
                alert("File uploaded successfully");
            } else {
                console.log(response.status)
                alert("Error uploading file")
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading file")
        } finally {
            loading = false;
        }
    }

    function handleFileChange(event) {
        file = event.target.files[0];
    }
</script>

<h1>Upload CSV</h1>

<!-- File Upload Form -->
<div class="container">
    <div>
        <input type="file" on:change={handleFileChange} accept=".csv" />
        <button on:click={uploadCSV}>Upload CSV</button>
    </div>
    
    <div class="spinner">
        {#if loading}
            <LoadingSpinner />
        {/if}
    </div>
</div>

<style>
    div {
        margin-top: 10px;
    }

    .container {
        display: flex;
        align-items: center;
        margin: 24px;
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

fetch('http://localhost:3000/api/jobs')
    .then(res => res.json())
    .then(data => {
        console.log('Success! API is working.');
        console.log(`Found ${data.length} jobs.`);
        if (data.length > 0) {
            console.log('Sample job:', data[0].title);
        }
    })
    .catch(err => console.error('Error fetching local API:', err));

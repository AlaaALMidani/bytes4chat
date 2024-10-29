const fetchContacts = async () => {
    try {
        const response = await fetch('https://d620-5-0-145-81.ngrok-free.app/contacts');
        if (!response.ok) {
            const errorText = await response.text(); // Get the error response as text
            console.error('Error response:', errorText); // Log it for debugging
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.contacts; // Return the contacts array
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return []; // Return an empty array on error
    }
};
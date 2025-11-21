import React, { useState } from "react";

export default function UpdateContact() {
    const [existingName, setExistingName] = useState("");
    const [contactName, setContactName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [responseMsg, setResponseMsg] = useState("");

    const handleUpdate = async (e) => {
        e.preventDefault();
        setResponseMsg("");

        const trimmedExisting = existingName.trim();
        if (!trimmedExisting) {
            setResponseMsg("Please enter the name of the contact to update.");
            return;
        }

        // Build payload only with fields provided
        const payload = {};
        if (contactName.trim()) payload.contact_name = contactName.trim();
        if (phoneNumber.trim()) payload.phone_number = phoneNumber.trim();
        if (message.trim()) payload.message = message.trim();
        if (imageUrl.trim()) payload.image_url = imageUrl.trim();

        if (Object.keys(payload).length === 0) {
            setResponseMsg("Please provide at least one field to update.");
            return;
        }

        try {
            const encodedName = encodeURIComponent(trimmedExisting);
            const res = await fetch(`http://localhost:8081/contacts/${encodedName}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                setResponseMsg(data?.message || `Error: HTTP ${res.status}`);
            } else {
                setResponseMsg(data?.message || `Contact '${trimmedExisting}' updated.`);
                // Optionally clear the fields (keep existing name for convenience)
                setContactName("");
                setPhoneNumber("");
                setMessage("");
                setImageUrl("");
            }
        } catch (error) {
            console.error("Error updating contact:", error);
            setResponseMsg("Network error while updating contact.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Update Contact</h2>
            <form onSubmit={handleUpdate}>
                <label>
                    Existing Contact Name (to update):
                    <input
                        type="text"
                        value={existingName}
                        placeholder="Name of contact to update"
                        onChange={(e) => setExistingName(e.target.value)}
                    />
                </label>
                <br /><br />

                <input
                    type="text"
                    placeholder="New Full Name (optional)"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                />
                <br /><br />
                <input
                    type="text"
                    placeholder="New Phone Number (optional)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <br /><br />
                <input
                    type="text"
                    placeholder="New Message (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <br /><br />
                <input
                    type="text"
                    placeholder="New Image URL (optional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
                <br /><br />
                <button type="submit">Update Contact</button>
            </form>
            {responseMsg && (
                <p style={{ marginTop: "15px", color: "blue" }}>{responseMsg}</p>
            )}
        </div>
    );
}

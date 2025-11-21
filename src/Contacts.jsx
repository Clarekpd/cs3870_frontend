import { useState, useEffect } from 'react';
const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [singleContact, setSingleContact] = useState(null);
    const [searchMsg, setSearchMsg] = useState("");

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch("http://localhost:8081/contacts");
                if (!response.ok) {
                    throw new Error("Failed to fetch contacts");
                }
                const data = await response.json();
                setContacts(data);
            } catch (error) {
                alert("There was an Error loading contacts " + error.message);
            }
        };
        fetchContacts();
    }, []);

    const getContact = async (name) => {
        setSearchMsg("");
        setSingleContact(null);
        if (!name) {
            setSearchMsg("Missing name to fetch.");
            return;
        }
        try {
            const encoded = encodeURIComponent(name);
            const res = await fetch(`http://localhost:8081/contacts/${encoded}`);
            if (res.status === 404) {
                const data = await res.json().catch(() => null);
                setSearchMsg(data?.message || `Contact '${name}' not found.`);
                return;
            }
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const contact = await res.json();
            setSingleContact(contact);
        } catch (err) {
            console.error("Get-one error:", err);
            setSearchMsg("Error fetching contact.");
        }
    };

    const clearSearch = () => {
        setSingleContact(null);
        setSearchMsg("");
    }

    return (
        <div className="container">
            <h2 className="text-center mt-4">Contacts List</h2>

            {searchMsg && <p>{searchMsg}</p>}

            {singleContact && (
                <div style={{ marginBottom: '16px' }}>
                    <h4>Selected Contact</h4>
                    <div className="list-group-item d-flex align-items-center">
                        {singleContact.image_url && (
                            <img
                                src={singleContact.image_url}
                                alt={singleContact.contact_name}
                                style={{ width: '50px', height: '50px', marginRight: '15px', objectFit: 'cover' }}
                            />
                        )}
                        <div>
                            <strong>{singleContact.contact_name}</strong> - {singleContact.phone_number}
                            <p>{singleContact.message}</p>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                            <button onClick={clearSearch}>Clear</button>
                        </div>
                    </div>
                </div>
            )}

            <ul className="list-group">
                {contacts.map((contact) => (
                    <li key={contact.id} className="list-group-item d-flex align-items-center">
                        {contact.image_url && (
                            <img
                                src={contact.image_url}
                                alt={contact.contact_name}
                                style={{ width: '50px', height: '50px', marginRight: '15px', objectFit: 'cover' }}
                            />
                        )}
                        <div>
                            <strong>{contact.contact_name}</strong> - {contact.phone_number}
                            <p>{contact.message}</p>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                            <button onClick={() => getContact(contact.contact_name)}>Get</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default Contacts;
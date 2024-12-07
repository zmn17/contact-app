import { Search, Star, Plus, MoreVertical, Loader } from "lucide-react";
import { useState, useEffect } from "react";

const Contacts = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate alphabet array for sidebar scroll
  const alphabet = Array.from("ABCDEFGHJIKLMNOPQRSTUWXYZ#");

  // Fetch contacts from https://jsonplaceholder.typicode.com/users API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }

        const data = await response.json();

        // Transform the API data to match our contact format
        const transformedContacts = data.map((user) => ({
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          favorite: false,
          avatar: `https://picsum.photos/100?random=${user.id}`,
        }));

        setContacts(transformedContacts);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Group contacts by first letter
  const groupedContacts = filteredContacts.reduce((acc, contact) => {
    const firstLetter = contact.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(contact);
    return acc;
  }, {});

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Error loading contacts: {error}</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
    >
      <div className="max-w-4xl p-4 mx-auto">
        {/* HEADERS */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Contacts</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <Plus className="w-6 h-6" />
            <MoreVertical className="w-6 h-6" />
          </div>
        </div>

        {/* SEARCH BAR */}
        <div
          className={`relative mb-6 ${darkMode ? "bg-gray-800" : "bg-gray-100"} rounded-lg`}
        >
          <Search className="absolute text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-100"
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* MAIN CONTENT */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 text-gray-500 animate-spin" />
          </div>
        ) : (
          <div className="flex">
            {/* Contact List */}
            <div className="flex-1">
              {Object.entries(groupedContacts)
                .sort()
                .map(([letter, contactGroup]) => (
                  <div key={letter} className="mb-6">
                    <h2 className="mb-2 text-lg font-semibold">{letter}</h2>
                    {contactGroup.map((contact) => (
                      <div
                        key={contact.id}
                        className={`flex items-center p-3 rounded-lg mb-2 ${
                          darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                        }`}
                      >
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-10 h-10 mr-3 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-gray-500">
                            {contact.phone}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contact.email}
                          </div>
                        </div>
                        <Star
                          className={`w-5 h-5 cursor-pointer ${
                            contact.favorite
                              ? "text-yellow-400 fill-current"
                              : "text-gray-400"
                          }`}
                          onClick={() => {
                            setContacts(
                              contacts.map((c) =>
                                c.id === contact.id
                                  ? { ...c, favorite: !c.favorite }
                                  : c,
                              ),
                            );
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
            </div>

            {/* ALPHABET SIDEBAR */}
            <div className="flex flex-col items-center ml-4">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  className="px-2 py-1 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT COUNT */}
        <div className="mt-4 text-sm text-gray-500">
          {contacts.length} {contacts.length === 1 ? "contact" : "contacts"}
        </div>
      </div>
    </div>
  );
};

export default Contacts;

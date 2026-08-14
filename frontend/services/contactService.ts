export interface Contact {
  id: string;
  name: string;
  handle: string;
  avatar: string;
}

export const contactService = {
  // Returns contacts for the current user — to be wired to the backend contacts API
  getFrequentContacts: (): Contact[] => [],
};

export default contactService;

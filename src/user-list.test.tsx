import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from "@testing-library/user-event";
import UserList from './user-list';
import '@testing-library/jest-dom';

const mockData = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    address: {
      street: "Kulas Light",
      suite: "Apt. 556",
      city: "Gwenborough",
      zipcode: "92998-3874",
      geo: {
        lat: "-37.3159",
        lng: "81.1496",
      },
    },
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: {
      name: "Romaguera-Crona",
      catchPhrase: "Multi-layered client-server neural-net",
      bs: "harness real-time e-markets",
    },
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "Shanna@melissa.tv",
    address: {
      street: "Victor Plains",
      suite: "Suite 879",
      city: "Wisokyburgh",
      zipcode: "90566-7771",
      geo: {
        lat: "-43.9509",
        lng: "-34.4618",
      },
    },
    phone: "010-692-6593 x09125",
    website: "anastasia.net",
    company: {
      name: "Deckow-Crist",
      catchPhrase: "Proactive didactic contingency",
      bs: "synergize scalable supply-chains",
    },
  },
];

beforeEach(() => {
  vi.resetAllMocks();
});

describe('User List', () => {
  it('removes user', async () => {
    // ARRANGE
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: vi.fn().mockReturnValue('10')},
        json: () => Promise.resolve(mockData),
      })
    ) as Mock;
    render(<UserList />);
    
    // Wait for data to load
    await waitFor(() => expect(screen.getByText("Leanne Graham")).toBeInTheDocument());

    const removeButtons = await screen.findAllByText("Remove");
    expect(removeButtons.length).toBe(2);

    // ACT
    await userEvent.click(removeButtons[0]);

    // ASSERT
    expect(await screen.findAllByText("Remove")).toHaveLength(1);
  });

  it('filters users', async () => {
    // ARRANGE
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: vi.fn().mockReturnValue('10')},
        json: () => Promise.resolve(mockData),
      })
    ) as Mock;
    render(<UserList />);
    
    // Wait for data to load
    await waitFor(() => expect(screen.getByText("Leanne Graham")).toBeInTheDocument());

    const removeButtons = await screen.findAllByText("Remove");
    expect(removeButtons.length).toBe(2);

    // ACT
    const inputElement = screen.getByRole('textbox', { name: /filter-name/i }) as HTMLInputElement;
    await userEvent.type(inputElement, 'ervin');

    // ASSERT
    expect(inputElement.value).toBe('ervin');
    await waitFor(async () => {
      expect(await screen.findAllByText("Remove")).toHaveLength(1);
    }, { timeout: 1000 });
  });
})
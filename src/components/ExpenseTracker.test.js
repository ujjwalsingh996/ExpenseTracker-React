import { render,screen } from "@testing-library/react"
import ExpenseTracker from "./ExpenseTracker"

describe('Async Component', () => {
    test('renders Expenses if request succeeds', async () => {
        window.fetch = jest.fn();
        window.fetch.mockResolvedValueOnce({
            json: async () => [{id: '', title: ''}]
        });
        render(<ExpenseTracker/>)

        const ulItemElements = await screen.findAllByRole('heading');
        expect(ulItemElements).not.toHaveLength(0);
    })
})
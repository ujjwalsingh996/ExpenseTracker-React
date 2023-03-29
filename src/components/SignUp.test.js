import { render,screen } from "@testing-library/react"
import SignUp from "./SignUp"
import userEvent from "@testing-library/user-event"
import Login from "./Login"


describe('Sign Up component', () => {
    test('renders email as a text', () => {
    
        //arrange
        render(<SignUp/>);
    
        //act
        //..nothing
    
        //assert
        const signupElement = screen.getByText('Email', { exact: false} )
        expect(signupElement).toBeInTheDocument();
    }),
    test('renders password as a text', () => {
    
        //arrange
        render(<SignUp/>);
    
        //act
        //..nothing
    
        //assert
        const signupElement = screen.getByText('Confirm', { exact: false} )
        expect(signupElement).toBeInTheDocument();
    }),
    test('renders sign up as a text', () => {
    
        //arrange
        render(<SignUp/>);
    
        //act
        //..nothing
    
        //assert
        const signupElement = screen.getAllByText('Sign Up', { exact: false} )
        expect(signupElement).toBeInTheDocument();
    }),

    test('renders sign up as a text', () => {
    
        //arrange
        render(<SignUp/>);
    
        //act
        const buttonElement = screen.getByRole('button')
        userEvent.click(buttonElement)
    
        //assert
        const signupElement = screen.getAllByText('Email', { exact: false} )
        expect(signupElement).toBeInTheDocument();
    })
})

import userFlow from '@/assets/img.png'

/**
 * 应用程入口
 * @returns JSXElement
 */
export default function App() {
    return (
        <div className="p-2">
            <img
                src={userFlow}
                alt="user flow"
            />
            <h3>Welcome to Lisa tiktok_e-commence fe Page!</h3>
            <h3>Steps:</h3>
            <ol>
                <li>Click the user icon.</li>
                <li>Click the Login button.</li>
                <li>If you are a new user, click the Register button.</li>
                <li>If you are an existing user, enter your username and password.</li>
                <li>
                    Return to the index page and click on products to add them to your
                    cart.
                </li>
                <li>Click the Cart page to check your items.</li>
                <li>Click the Payment button to proceed with the checkout.</li>
            </ol>
        </div>
    )
}

export default function Footer() {
    return (
        <div className="bottom-0 left-0 right-0 mt-4">
            <hr className="border border-2xl" />
            <div className="container flex justify-between mt-5">
                <div className="left inline-flex">
                    <h2>Lets Go</h2>
                    <span>© Lets Go International Ltd. 2023</span>
                </div>
                <div className="right flex space-x-2 gap-2 text-center item-center">
                    <div className="social flex space-x-2">
                        <img className="w-5 h-5 text-center" src="/twitter.png" alt="" />
                        <img className="w-5 h-5 text-center" src="/facebook.png" alt="" />
                        <img className="w-5 h-5 text-center" src="/linkedin.png" alt="" />
                        <img className="w-5 h-5 text-center" src="/pinterest.png" alt="" />
                        <img className="w-5 h-5 text-center" src="/instagram.png" alt="" />
                    </div>
                    <div className="link inline-flex space-x-2">
                        <img className="w-5 h-5 text-center" src="/language.png" alt="" />
                    </div>
                    <img className="w-5 h-5 text-center" src="/accessibility.png" alt="" />
                </div>
            </div>
        </div>
    );
}



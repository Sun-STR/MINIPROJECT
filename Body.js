"use client";
export default function Body() {
    return (
        <div className="container max-w-7xl mx-auto my-20 pb-20 px-4">
            <div className="text-center mb-12">
            <br></br>
                <h1 className="text-4xl font-bold text-yellow-600 mb-4">Paris Olympics 2024</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-teal-500">
                    <h2 className="text-2xl font-bold text-teal-600 mb-4">Our Services</h2>
                    <ul className="list-disc list-inside text-gray-700">
                        <li>Country</li>
                        <li>Athlete</li>
                        <li>Medal</li>
                        <li>Gold</li>
                        <li>Silver</li>
                        <li>Bronze</li>
                        <li>Total</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
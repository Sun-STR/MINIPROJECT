
"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

function RetrieveData({ olympics, index, onEdit, onDelete }) {
    return (
        <tr>
            <td className="py-2 px-4">{index + 1}</td>
            <td className="py-2 px-4">{olympics.country}</td>
            <td className="py-2 px-4">{olympics.athlete}</td>
            <td className="py-2 px-4">{olympics.gender}</td>
            <td className="py-2 px-4">{olympics.gold}</td>
            <td className="py-2 px-4">{olympics.silver}</td>
            <td className="py-2 px-4">{olympics.bronze}</td>
            <td className="py-2 px-4">{olympics.total_medals}</td>
            <td className="py-2 px-4">
                <button
                    onClick={() => onEdit(olympics)}
                    className="text-blue-500 hover:text-blue-700"
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>

                <button
                    onClick={() => onDelete(olympics)}
                    className="text-red-500 hover:text-red-700 ml-2"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </td>
        </tr>
    );
}

export default function olympics2024() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [selectedData, setSelectedData] = useState({
        country: "",
        athlete: "",
        gender: "",
        gold: "",
        silver: "",
        bronze: "",
        total_medals: "",
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

const [currentPage, setCurrentPage] = useState(1);
const dataPerPage = 10;

// Calculate the current data to be shown on the current page
const indexOfLastData = currentPage * dataPerPage;
const indexOfFirstData = indexOfLastData - dataPerPage;
const currentData = data.slice(indexOfFirstData, indexOfLastData);

const totalPages = Math.ceil(data.length / dataPerPage);

const pageGroupSize = 10;
const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);

const startPage = currentGroup * pageGroupSize + 1;
const endPage = Math.min((currentGroup + 1) * pageGroupSize, totalPages);
const displayedPages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
};

const handleNextPage = () => {
    if (currentPage < endPage) {
        setCurrentPage(currentPage + 1);
    }
};
const handlePreviousPage = () => {
    if (currentPage > startPage) {
        setCurrentPage(currentPage - 1);
    }
};
const handleNextGroup = () => {
    if (currentGroup < Math.floor(totalPages / pageGroupSize)) {
        setCurrentPage((currentGroup + 1) * pageGroupSize + 1);
    }
};
const handlePreviousGroup = () => {
    if (currentGroup > 0) {
        setCurrentPage(currentGroup * pageGroupSize);
    }
};
    useEffect(() => {
        fetch("http://localhost:3001/olympics2024")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        setSearch(search.trim());
        if (search === "") {
            fetch("http://localhost:3001/olympics2024")
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    setData(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
            fetch("http://localhost:3001/olympics2024/search/" + search, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    setData(data);
                })
                .catch((err) => {
                    console.log(err);
                });
    }, [search]);

    const handleEditClick = (olympics) => {
        setSelectedData(olympics);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:3001/olympics2024/update/", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
            })
            .catch((err) => {
                console.log(err);
            });
        setIsEditModalOpen(false);
    };

    const handleDeleteClick = (olympics) => {
        setSelectedData(olympics);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDeleteSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:3001/olympics2024/delete/", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
            })
            .catch((err) => {
                console.log(err);
            });
        setIsDeleteModalOpen(false);
    };

    const handleCreateClick = () => {
        setSelectedData({
            country: "",
            athlete: "",
            gender: "",
            gold: "",
            silver: "",
            bronze: "",
            total_medals: "",
        });
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    // เพิ่มฟังก์ชันสำหรับ handleSearch
const handleSearch = () => {
    if (search.trim() === "") {
        // กรณีที่ search ว่าง จะ fetch ข้อมูลทั้งหมด
        fetch("http://localhost:3001/olympics2024")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        // Fetch ข้อมูลที่ค้นหา
        fetch("http://localhost:3001/olympics2024/search/" + search, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
};

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:3001/olympics2024/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
            })
            .catch((err) => {
                console.log(err);
            });
        setIsCreateModalOpen(false);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 pt-8 mt-8">
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 pt-8 mt-8 my-20 pb-20">
            <h1 className="text-3xl font-bold mb-4">Olympic</h1>
            <div className="flex flex-row mb-4">
                <input
                    type="text"
                    className="w-96 border-2 border-yellow-500 p-2 rounded-lg"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button 
    onClick={handleSearch} // เพิ่มการเชื่อมโยงฟังก์ชัน handleSearch
    className="bg-yellow-500 text-white px-4 py-2 rounded-lg ml-2">
    Search
</button>

                <button
                    onClick={handleCreateClick}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg ml-2 float-right"
                >
                    Add Olympic
                </button>
            </div>
            <table className="min-w-full bg-white table-auto border-b-4 border-teal-500 shadow-lg">
                <thead className="bg-teal-500 text-white text-left">
                    <tr>
                        <th className="py-2 px-4 border-b">NO</th>
                        <th className="py-2 px-4 border-b">Country</th>
                        <th className="py-2 px-4 border-b">Athlete</th>
                        <th className="py-2 px-4 border-b">Gender</th>
                        <th className="py-2 px-4 border-b">Gold</th>
                        <th className="py-2 px-4 border-b">Silver</th>
                        <th className="py-2 px-4 border-b">Bronze</th>
                        <th className="py-2 px-4 border-b">Total</th>
                        <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((olympics, index) => (
                        <RetrieveData
                            key={index}
                            olympics={olympics}
                            index={indexOfFirstData + index}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </tbody>
            </table>
            <div style={{ textAlign: "center", margin: "20px 0" }}>
        {/* Previous Group Button */}
        <button
            onClick={handlePreviousGroup}
            disabled={currentGroup === 0}
            style={{
                padding: "10px 15px",
                margin: "0 5px",
                border: "none",
                backgroundColor: "#4CAF50",
                color: "white",
                cursor: currentGroup === 0 ? "not-allowed" : "pointer",
                borderRadius: "5px",
                opacity: currentGroup === 0 ? 0.5 : 1,
                transition: "background-color 0.3s",
            }}
        >
            Previous Group
        </button>

        {/* Previous Page Button */}
        <button
            onClick={handlePreviousPage}
            disabled={currentPage === startPage}
            style={{
                padding: "10px 15px",
                margin: "0 5px",
                border: "none",
                backgroundColor: "#4CAF50",
                color: "white",
                cursor: currentPage === startPage ? "not-allowed" : "pointer",
                borderRadius: "5px",
                opacity: currentPage === startPage ? 0.5 : 1,
                transition: "background-color 0.3s",
            }}
        >
            Previous
        </button>

        {/* Render page numbers for the current group */}
        {displayedPages.map((pageNumber) => (
            <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                style={{
                    padding: "10px 15px",
                    margin: "0 5px",
                    border: "none",
                    backgroundColor: currentPage === pageNumber ? "#4CAF50" : "#f1f1f1",
                    color: currentPage === pageNumber ? "white" : "#333",
                    cursor: "pointer",
                    borderRadius: "5px",
                    fontWeight: currentPage === pageNumber ? "bold" : "normal",
                    transition: "background-color 0.3s, color 0.3s",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#ddd"}
                onMouseLeave={(e) => e.target.style.backgroundColor = currentPage === pageNumber ? "#4CAF50" : "#f1f1f1"}
            >
                {pageNumber}
            </button>
        ))}

        {/* Next Page Button */}
        <button
            onClick={handleNextPage}
            disabled={currentPage === endPage}
            style={{
                padding: "10px 15px",
                margin: "0 5px",
                border: "none",
                backgroundColor: "#4CAF50",
                color: "white",
                cursor: currentPage === endPage ? "not-allowed" : "pointer",
                borderRadius: "5px",
                opacity: currentPage === endPage ? 0.5 : 1,
                transition: "background-color 0.3s",
            }}
        >
            Next
        </button>

        {/* Next Group Button */}
        <button
            onClick={handleNextGroup}
            disabled={currentGroup === Math.floor(totalPages / pageGroupSize)}
            style={{
                padding: "10px 15px",
                margin: "0 5px",
                border: "none",
                backgroundColor: "#4CAF50",
                color: "white",
                cursor: currentGroup === Math.floor(totalPages / pageGroupSize) ? "not-allowed" : "pointer",
                borderRadius: "5px",
                opacity: currentGroup === Math.floor(totalPages / pageGroupSize) ? 0.5 : 1,
                transition: "background-color 0.3s",
            }}
        >
            Next Group
        </button>
    </div>

            {/* Modals for Create, Edit, and Delete */}
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Edit Olympic</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="country"
                                >
                                    country
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    value={selectedData.country}
                                    onChange={(e) =>
                                        setSelectedData({
                                            ...selectedData,
                                            country: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="athlete"
                                >
                                    athlete
                                </label>
                                <input
                                    type="text"
                                    id="athlete"
                                    value={selectedData.athlete}
                                    onChange={(e) =>
                                        setSelectedData({
                                            ...selectedData,
                                            athlete: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="gender"
                                >
                                    gender
                                </label>
                                <input
                                    type="text"
                                    id="gender"
                                    value={selectedData.gender}
                                    onChange={(e) =>
                                        setSelectedData({
                                            ...selectedData,
                                            gender: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="gold"
                                >
                                    gold
                                </label>
                                <input
                                    type="int"
                                    id="GOld"
                                    value={selectedData.gold}
                                    onChange={(e) =>
                                        setSelectedData({
                                            ...selectedData,
                                            gold: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="silver"
                                >
                                    silver
                                </label>
                                <input
                                    type="int"
                                    id="silver"
                                    value={selectedData.silver}
                                    onChange={(e) =>
                                        setSelectedData({
                                            ...selectedData,
                                            silver: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="bronze"
                                >
                                    bronze
                                </label>
                                <input
                                    type="text"
                                    id="bronze"
                                    value={selectedData.bronze}
                                    onChange={(e) =>
                                        setSelectedData({
                                            ...selectedData,
                                            bronze: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="total_medals"
                                >
                                    total_medals
                                </label>
                                <input
                                    type="text"
                                    id="total_medals"
                                    value={selectedData.total_medals}
                                    onChange={(e) =>
                                        setSelectedData({
                                            ...selectedData,
                                            total_medals: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseEditModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Delete Olympic</h2>
                        <p>Are you sure you want to delete {selectedData.country}?</p>
                        <div className="flex items-center justify-between mt-4">
                            <button
                                onClick={handleDeleteSubmit}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Delete
                            </button>
                            <button
                                onClick={handleCloseDeleteModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isCreateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Create Olympic</h2>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="country"
                                >
                                    country
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    onChange={(e) =>
                                        setSelectedData({
                                            ...selectedData,
                                            country: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor=" athlete"
                                >
                                    athlete
                                </label>
                                <input
                                    type="text"
                                    id="athlete"
                                    onChange={(e) =>
                                        setSelectedData({
                                            ...selectedData,
                                            athlete: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="gender"
                                >
                                    gender
                                </label>
                                <input
                                    type="text"
                                    id="gender"
                                    onChange={(e) =>
                                        setSelectedData({
                                            ...selectedData,
                                            gender: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="gold"
                                >
                                    gold
                                </label>
                                <input
                                    type="int"
                                    id="gold"
                                    onChange={(e) =>
                                        setSelectedData({
                                            ...selectedData,
                                            gold: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="silver"
                                >
                                    silver
                                </label>
                                <input
                                    type="int"
                                    id="silver"
                                    onChange={(e) =>
                                        setSelectedData({
                                            ...selectedData,
                                            silver: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="bronze"
                                >
                                    bronze
                                </label>
                                <input
                                    type="int"
                                    id="bronze"
                                    onChange={(e) =>
                                        setSelectedData({
                                            ...selectedData,
                                            bronze: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="total_medals"
                                >
                                    total_medals
                                </label>
                                <input
                                    type="int"
                                    id="total_medals"
                                    onChange={(e) =>
                                        setSelectedData({
                                            ...selectedData,
                                            total_medals: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseCreateModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

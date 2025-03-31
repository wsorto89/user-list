// User API and State Management Task
// https://jsonplaceholder.typicode.com/

import { useEffect, useMemo, useState } from "react";

// Task: Using the API endpoint
// https://jsonplaceholder.typicode.com/users
// Fetch a list of users and save them in a component's state.
// Add an input field to filter the list of users by name.
// Additionally, provide a "Remove" button next to each user name,
// which removes that user from the list when clicked.
// familiarity with pagination
// Write unit tests for your component

// BONUS
// Build a custom hook to fetch users

type User = {
  id: number;
  name: string;
};

const useDebounce = <T extends unknown>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useFetchUsers = (page: number, limit: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUserList = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${limit}`,
          {
            signal,
          }
        );
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }
        const data = (await response.json()) as User[];
        const totalCount = response.headers.get("X-Total-Count");
        setTotalCount(totalCount ? parseInt(totalCount) : 0);
        setUserList(data);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setError(error.message);
          console.error("Fetch error: ", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserList();
    return () => {
      controller.abort();
    };
  }, [page, limit]);

  return {
    isLoading,
    userList,
    error,
    totalCount,
    setUserList,
  };
};

const PAGE_LIMIT = 5;

const UserList = () => {
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedFilterValue = useDebounce(filterValue, 400);
  const { isLoading, userList, error, totalCount, setUserList } = useFetchUsers(
    currentPage,
    PAGE_LIMIT
  );

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };

  const handleRemoveClick = (id: number) => () => {
    setUserList((prev) => prev.filter((u) => u.id !== id));
  };

  const handlePageClick = (delta: number) => () => {
    setCurrentPage((prev) => prev + delta);
  };

  const filteredList = useMemo(
    () =>
      userList.filter((u) =>
        u.name.toUpperCase().includes(debouncedFilterValue.toUpperCase())
      ),
    [userList, debouncedFilterValue]
  );

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {!isLoading && !error && (
        <>
          <input
            type="text"
            value={filterValue}
            onChange={handleFilterChange}
            placeholder={"Filter by Name"}
            aria-label="filter-name"
          />
          <table>
            <tbody>
              {filteredList.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>
                    <button onClick={handleRemoveClick(u.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "1rem" }}>
            <button onClick={handlePageClick(-1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span style={{ margin: "1rem" }}>{`${
              (currentPage - 1) * PAGE_LIMIT + 1
            } - ${currentPage * PAGE_LIMIT} of ${totalCount} items`}</span>
            <button
              onClick={handlePageClick(1)}
              disabled={Math.ceil(totalCount / PAGE_LIMIT) === currentPage}
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default UserList;

/*
// Explain the code below

import { useState, useRef, useCallback } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  const increment = useCallback(() => {
    countRef.current = countRef.current + 1;
    setCount(countRef.current);
  }, [setCount]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <button onClick={increment}>Increment</button>
        <p>Count: {count}</p>
      </div>
    </main>
  );
}


// Question: Describe how you would design the architecture for
// a real-time chat application.

*/

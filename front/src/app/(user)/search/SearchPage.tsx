"use client";
import React, { useEffect, useState } from "react";
import FilterBar from "./FilterBar";
import { getAllCourse } from "@/app/api/course";
import { useQuery } from "@tanstack/react-query";
import SearchResult from "./SearchResult";
import { useSearchParams } from "next/navigation";
import { SearchCourseParams } from "@/app/types/course";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("kw") || "";
  const iniLabel = searchParams.get("label") || "";
  const [searchFilter, setSearchFilter] = useState<SearchCourseParams>({
    page: 1,
    limit: 6,
    order: "-createdAt",
    keyword: keyword,
    rating: 0,
    label: iniLabel,
    priceFrom: 0,
    priceTo: 10000000,
  });
  const { data } = useQuery({
    queryKey: [
      "search-courses",
      {
        searchFilter,
      },
    ],
    queryFn: () =>
      getAllCourse(
        searchFilter.page,
        searchFilter.limit,
        searchFilter.order,
        searchFilter.keyword,
        searchFilter.rating,
        searchFilter.label,
        searchFilter.priceFrom,
        searchFilter.priceTo,
      ),
  });
  const courses = data?.data || [];
  const totalPages = data?.pagination?.total_pages || 0;

  return (
    <div className="flex gap-4 p-8">
      <div className="basis-[20%]">
        <FilterBar setSearchFilter={setSearchFilter} />
      </div>
      <div className="basis-[80%]">
        {courses.length > 0 && (
          <div className="min-h-[500px]">
            <div className="mb-4 flex justify-between">
              {keyword ? (
                <p className="text-2xl font-bold">
                  Search result for '{keyword}'
                </p>
              ) : (
                <div></div>
              )}
              <FormControl size="small">
                <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={searchFilter.order}
                  label="Sort by"
                  onChange={(v) =>
                    setSearchFilter((prev) => ({
                      ...prev,
                      order: v.target.value,
                    }))
                  }
                >
                  <MenuItem value={"-createdAt"}>Newest</MenuItem>
                  <MenuItem value={"createdAt"}>Oldest</MenuItem>
                  <MenuItem value={"-rating"}>Top Rating</MenuItem>
                  <MenuItem value={"title"}>A {"->"} Z</MenuItem>
                  <MenuItem value={"-title"}>Z {"->"} A</MenuItem>
                </Select>
              </FormControl>
            </div>
            <SearchResult courses={courses} />
          </div>
        )}
        {courses.length === 0 && (
          <div className="flex h-[400px] w-full items-center justify-center text-center text-lg">
            No result found
          </div>
        )}
        <div className="my-4 flex justify-center">
          <Pagination
            count={totalPages}
            page={searchFilter.page}
            onChange={(e, value) => {
              setSearchFilter((prev) => ({ ...prev, page: value }));
            }}
            variant="outlined"
            color="primary"
          />
        </div>
      </div>
    </div>
  );
}

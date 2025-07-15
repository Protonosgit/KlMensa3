"use client";
import Meal from './meal';
import { applyClientFilters } from '@/app/utils/filter.js';
import { getCookie } from "@/app/utils/cookie-monster";
import { useEffect, useState } from 'react';


export default function DataBridge({ mealDay,index, comments, images, set}) {
    const [locationFilter, setLocationFilter] = useState([])
    const [proteinFilter, setProteinFilter] = useState([])
    const [additiveFilter, setAdditiveFilter] = useState([])

    useEffect(() => {
        setLocationFilter(JSON.parse(getCookie('location')));
        setProteinFilter(JSON.parse(getCookie('protein')));
        setAdditiveFilter(JSON.parse(getCookie('additive')));
        //
      }, []);

  return (
    <>
      {applyClientFilters(
        locationFilter,
        proteinFilter,
        additiveFilter,
        mealDay?.meals
      ).map((meal, mealIndex) => {
        const filteredComments = () => {
          if (comments && comments.length > 0) {
            return comments.filter(
              (comment) => comment?.article_id === meal?.artikel_id
            );
          }
          return [];
        };
        const filteredImages = () => {
          if (images && images.length > 0) {
            return images.filter(
              (image) => image?.article_id === meal?.artikel_id
            );
          }
          return [];
        };
        return (
          <Meal
            key={mealIndex}
            meal={meal}
            mealIndex={mealIndex}
            mealComments={filteredComments()}
            mealImages={filteredImages()}
          />
        );
      })}
    </>
  );
}

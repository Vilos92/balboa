import {NextSeo} from 'next-seo';
import {OpenGraph, Twitter} from 'next-seo/lib/types';
import React, {FC} from 'react';

/*
 * Types.
 */

interface SearchEngineOptimizerProps {
  title: string;
  description: string;
}

/*
 * Components.
 */

export const SearchEngineOptimizer: FC<SearchEngineOptimizerProps> = ({title, description}) => {
  const openGraph: OpenGraph = {
    title,
    description
  };

  const twitter: Twitter = {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image'
  };

  return <NextSeo title={title} description={description} openGraph={openGraph} twitter={twitter} />;
};

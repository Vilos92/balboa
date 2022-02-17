import {NextSeo} from 'next-seo';
import {OpenGraph, Twitter} from 'next-seo/lib/types';
import React, {FC} from 'react';

/*
 * Types.
 */

interface SearchEngineOptimizerProps {
  title?: string;
  description?: string;
}

/*
 * Components.
 */

/**
 * Attaches parameters to the head of the document to set the current title and to
 * allow preview links. If preview links are desired this must only be used with
 * server-side rendered props.
 */
export const SearchEngineOptimizer: FC<SearchEngineOptimizerProps> = ({
  title: titleArg,
  description: descriptionArg
}) => {
  const title = titleArg ? `[Grueplan] ${titleArg}` : 'Grueplan';
  const description = descriptionArg ?? 'Keep track of your plans';

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

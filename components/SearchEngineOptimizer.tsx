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
 * Constants.
 */

const defaultTitle = 'Grueplan';
const defaultDescription = ' Keep track of your plans';

/*
 * Components.
 */

/**
 * Attaches parameters to the head of the document to set the current title and to
 * allow preview links. If preview links are desired this must only be used with
 * server-side rendered props.
 */
export const SearchEngineOptimizer: FC<SearchEngineOptimizerProps> = ({
  title,
  description: descriptionArg
}) => {
  const pageTitle = title ? `${title} | Grueplan` : defaultTitle;

  const previewTitle = title ? `${title}` : defaultTitle;
  const previewDescription = descriptionArg ?? defaultDescription;

  const openGraph: OpenGraph = {
    type: 'website',
    title: previewTitle,
    description: previewDescription
  };

  const twitter: Twitter = {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image'
  };

  return (
    <NextSeo title={pageTitle} description={previewDescription} openGraph={openGraph} twitter={twitter} />
  );
};

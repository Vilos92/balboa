import {NextPage} from 'next';
import {FC} from 'react';
import styled from 'styled-components';
import {SWRConfig} from 'swr';
import tw from 'twin.macro';

import {GetTvMazeShowsResponse, getTvMazeShows} from '../../externalApi/tvMaze';
import {useNetGet} from '../../utils/hooks';
import {showsUrl} from '../api/shows';

/*
 * Styles.
 */

const ShowsBarDiv = styled.div`
  &::-webkit-scrollbar {
    display: none;
  }

  ${tw`
    flex
    overflow-x-auto
    mb-4
    p-4
  `}
`;

const ShowImg = styled.img`
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.09);
  }

  ${tw`
    m-2
    w-40
  `}
`;

/*
 * Props.
 */

interface ShowsContainerProps {
  fallback: {[key: string]: GetTvMazeShowsResponse};
}

interface ShowsBarProps {
  shows: GetTvMazeShowsResponse;
}

export async function getStaticProps() {
  // TODO: Use same DB retrieval which is used as internal shows URL.
  const shows = await getTvMazeShows(1);

  return {
    props: {
      fallback: {
        [showsUrl]: shows
      }
    }
  };
}

/*
 * Component.
 */

const Shows = () => {
  const {data: shows, error} = useNetGet<GetTvMazeShowsResponse>(showsUrl);

  if (error) return <>failed to load</>;
  if (!shows) return <>loading...</>;

  return <ShowsBar shows={shows} />;
};

const ShowsBar: FC<ShowsBarProps> = ({shows}) => {
  const showNodes = shows.map(show => (
    <a key={show.id} href={`/shows/${show.id}`}>
      <ShowImg src={show.image.medium} />
    </a>
  ));

  return <ShowsBarDiv>{showNodes}</ShowsBarDiv>;
};

const ShowsContainer: NextPage<ShowsContainerProps> = ({fallback}) => {
  return (
    <SWRConfig value={{fallback}}>
      <Shows />
    </SWRConfig>
  );
};

export default ShowsContainer;

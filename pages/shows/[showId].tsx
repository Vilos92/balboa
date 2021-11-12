import {FC} from 'react';
import tw from 'twin.macro';

import {GetTvMazeShowResponse, getTvMazeShow} from '../../externalApi/tvMaze';

/*
 * Styles.
 */

const ContainerDiv = tw.div`
  flex
  flex-col
  items-center
  justify-center
  min-h-screen
  py-2
`;

const ShowDiv = tw.div`
  flex
  flex-wrap
  content-start
  border
  list-none
  rounded-sm
`;

const ShowImg = tw.img`
  h-32
`;

const ShowDetailsDiv = tw.div`
  pl-2
`;

const ShowHeader = tw.h1`
  text-gray-700
  font-semibold
  text-xl
`;

const ShowGenreSpan = tw.span`
  px-2
  py-0.5
  mr-0.5
  rounded
  text-xs
  font-bold
  bg-blue-500
  text-white
`;

/*
 * Props.
 */

interface ShowProps {
  show: GetTvMazeShowResponse;
}

export async function getServerSideProps({query}) {
  const {showId} = query;

  const show = await getTvMazeShow(parseInt(showId));

  if (!show) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      show
    }
  };
}

/*
 * Component.
 */

const Show: FC<ShowProps> = ({show}) => {
  return (
    <ContainerDiv>
      <ShowDiv>
        <ShowImg src={show.image.medium} />
        <ShowDetailsDiv>
          <ShowHeader>{show.name}</ShowHeader>
          {show.genres.map(genre => (
            <ShowGenreSpan key={genre}>{genre}</ShowGenreSpan>
          ))}
        </ShowDetailsDiv>
      </ShowDiv>
    </ContainerDiv>
  );
};

export default Show;

import {FC} from 'react';
import tw from 'twin.macro';

import {FetchShowResponse, getExternalShow} from '../api/shows';

/*
 * Styles.
 */

const TwContainer = tw.div`
  flex
  flex-col
  items-center
  justify-center
  min-h-screen
  py-2
`;

const TwShowDiv = tw.div`
  flex
  flex-wrap
  content-start
  border
  list-none
  rounded-sm
`;

const TwShowImg = tw.img`
  h-32
`;

const TvShowDetailsDiv = tw.div`
  pl-2
`;

const TwShowHeader = tw.h1`
  text-gray-700
  font-semibold
  text-xl
`;

const TwShowGenreSpan = tw.span`
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
  show: FetchShowResponse;
}

export async function getServerSideProps({query}) {
  const {showId} = query;

  const show = await getExternalShow(parseInt(showId));

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
    <TwContainer>
      <TwShowDiv>
        <TwShowImg src={show.image.medium} />
        <TvShowDetailsDiv>
          <TwShowHeader>{show.name}</TwShowHeader>
          {show.genres.map(genre => (
            <TwShowGenreSpan key={genre}>{genre}</TwShowGenreSpan>
          ))}
        </TvShowDetailsDiv>
      </TwShowDiv>
    </TwContainer>
  );
};

export default Show;

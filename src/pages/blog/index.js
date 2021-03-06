import React from 'react';
import { graphql } from 'gatsby';

import PageContainer from '../../lib/PageContainer';
import Helmet from 'react-helmet';
import Navbar, { NavBarSpacer } from '../../components/Navbar';
import Footer from '../../components/Footer';
import BannerContainer from '../../components/Containers/BannerContainer';
import { renderWebMonetizationMeta } from '../../lib/WebMonetization';
import WhiteHugeTitle from '../../components/WhiteHugeTitle';

import TransparentContainer from '../../components/Containers/TransparentContainer';
import SkewedBorderContainer from '../../components/Containers/SkewedBorderContainer';
import CenteredRow from '../../components/Grid/CenteredRow';
import BlogCard from '../../components/Blog/BlogCard';
import WhiteParagraph from '../../components/WhiteParagraph';

const List = function ({ data, pageContext }) {
  const thumbnails = data.allFile.edges;
  const posts = data.allMarkdownRemark.edges;
  return (
    <PageContainer {...pageContext}>
      {(t) => {
        return (
          <React.Fragment>
            <Helmet title={t('GDevelop Blog')}>
              <html lang={pageContext.localeCode} />
              <meta
                name="description"
                content="GDevelop is a game creator bundled with dozens of features to imagine and create any kind of games. No coding skills are required."
              />
              {renderWebMonetizationMeta()}
            </Helmet>
            <Navbar t={t} />
            <BannerContainer>
              <NavBarSpacer />
              <WhiteHugeTitle>{t('GDevelop Blog')}</WhiteHugeTitle>
              <WhiteParagraph>
                {t(
                  'The blog of the GDevelop team, contributors and community.'
                )}
              </WhiteParagraph>
            </BannerContainer>
            {posts.map(({ node }, i) => {
              const title = node.frontmatter.title || node.fields.slug;
              const content = node.frontmatter.description || node.excerpt;
              const index = i;
              const slug = node.fields.slug.replace(/\//gi, '');
              let thumbnail = null;

              for (let n of thumbnails) {
                const { node } = n;
                if (
                  node.relativeDirectory === slug &&
                  node.name === 'thumbnail'
                ) {
                  thumbnail = node.publicURL;
                  break;
                }
              }
              return (
                <React.Fragment>
                  {index % 2 === 0 ? (
                    <TransparentContainer>
                      <CenteredRow key={node.fields.slug}>
                        <BlogCard
                          title={title}
                          content={content}
                          link={'/blog/post' + node.fields.slug}
                          date={node.frontmatter.date}
                          thumbnail={thumbnail}
                          author={node.frontmatter.author}
                        />
                      </CenteredRow>
                    </TransparentContainer>
                  ) : (
                    <SkewedBorderContainer>
                      <CenteredRow key={node.fields.slug}>
                        <BlogCard
                          title={title}
                          content={content}
                          link={'/blog/post' + node.fields.slug}
                          date={node.frontmatter.date}
                          thumbnail={thumbnail}
                          author={node.frontmatter.author}
                        />
                      </CenteredRow>
                    </SkewedBorderContainer>
                  )}
                </React.Fragment>
              );
            })}
            <Footer t={t} />
          </React.Fragment>
        );
      }}
    </PageContainer>
  );
};

export default List;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { hidden: { ne: true } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 350)
          fields {
            slug
          }
          frontmatter {
            date
            title
            description
            hidden
            author
          }
        }
      }
    }
    allFile(filter: { sourceInstanceName: { eq: "blog" } }) {
      edges {
        node {
          publicURL
          relativeDirectory
          name
        }
      }
    }
  }
`;

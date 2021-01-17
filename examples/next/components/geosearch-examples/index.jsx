import { useSearchkitQuery, useSearchkit } from '@searchkit/client'
import { gql } from '@apollo/client'
import { useState } from 'react'
import PlacesSearchInput from './Input'
import {
  FacetsList,
  Pagination,
  ResetSearchButton,
  SelectedFilters,
} from '@searchkit/elastic-ui'

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiPageSideBar,
  EuiTitle,
  EuiHorizontalRule,
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem
} from '@elastic/eui'

const query = gql`
  query resultSet($query: String, $filters: [SKFiltersSet], $page: SKPageInput, $sortBy: String) {
    usParks(query: $query, filters: $filters) {
      summary {
        total
        appliedFilters {
          id
          identifier
          display
          label
          ... on DateRangeSelectedFilter {
            dateMin
            dateMax
          }
          ... on NumericRangeSelectedFilter {
            min
            max
          }
          ... on ValueSelectedFilter {
            value
          }
        }
        sortOptions {
          id
          label
        }
        query
      }
      hits(page: $page, sortBy: $sortBy) {
        page {
          total
          totalPages
          pageNumber
          from
          size
        }
        sortedBy
        items {
          ... on ParkResultHit {
            id
            fields {
              title
              location
            }
          }
        }
      }
      facets {
        identifier
        type
        label
        display
        entries {
          id
          label
          count
        }
      }
    }
  }
`

export const HitsList = ({ data }) => (
  <>
    {data?.usParks.hits.items.map((hit) => (
      <EuiFlexGroup gutterSize="xl" key={hit.id}>
      <EuiFlexItem>
        <EuiFlexGroup>
          <EuiFlexItem grow={4}>
            <EuiTitle size="xs">
              <h6>{hit.fields.title}</h6>
            </EuiTitle>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
    ))}
  </>
)

const LocationFilter = ({ filter, loading }) => {
  return null
}

const Page = () => {
  const { data, loading } = useSearchkitQuery(query)
  return (
    <EuiPage>
      <EuiPageSideBar>
        <PlacesSearchInput />
        <EuiHorizontalRule margin="m" />
      </EuiPageSideBar>
      <EuiPageBody component="div">
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <SelectedFilters data={data?.usParks} loading={loading} customFilterComponents={{
                GeoBoundingBoxFilter: LocationFilter
              }} />
            </EuiTitle>
          </EuiPageHeaderSection>
          <EuiPageHeaderSection>
            <ResetSearchButton loading={loading} />
          </EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageContent>
          <EuiPageContentHeader>
            <EuiPageContentHeaderSection>
              <EuiTitle size="s">
                <h2>{data?.usParks.summary.total} Results</h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>
            <HitsList data={data} />
            <EuiFlexGroup justifyContent="spaceAround">
              <Pagination data={data?.usParks} />
            </EuiFlexGroup>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  )
}

export default Page

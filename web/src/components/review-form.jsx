import React from 'react';

import '../../css/review-form.css';

const PAGE_SIZE = 3;
const DEFAULT_STATE = {
  page: 0,
  reviewed: [],
};

export default class ReviewForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
    this.state.reviewed = new Array(this.props.sentences.length);
    this.onSubmit = this.onSubmit.bind(this);
    this.setPage = this.setPage.bind(this);

    this.state.sentences = this.props.sentences.map((sentence) => {
      return {
        sentence,
      };
    });
  }

  getTotalPages() {
    return Math.ceil(this.props.sentences.length / PAGE_SIZE);
  }

  getLastPage() {
    return this.getTotalPages() - 1;
  }

  getOffset() {
    return this.state.page * PAGE_SIZE;
  }

  onSubmit(evt) {
    evt.preventDefault();
    let validated = [];
    let invalidated = [];

    // Extract sentence that have been voted on.
    const unreviewed = this.state.sentences.filter((sentenceInfo) => {
      if (sentenceInfo.reviewApproval) {
        validated.push(sentenceInfo.sentence);
        return false;
      }

      if (sentenceInfo.reviewApproval === false) {
        invalidated.push(sentenceInfo.sentence);
        return false;
      }

      return true;
    }).map((sentenceInfo) => sentenceInfo.sentence);

    this.props.onReviewed({
      validated,
      invalidated,
      unreviewed,
    });
  }

  setPage(page) {
    this.setState({
      page,
    });
  }

  reviewSentence(index, approval) {
    const sentences = this.state.sentences;

    if (sentences[index].reviewApproval === approval) {
      // already set before, deselecting now
      sentences[index].reviewApproval = undefined;
    } else {
      sentences[index].reviewApproval = approval;
    }

    this.setState({ sentences });
  }

  render() {
    if (!this.props.sentences && this.props.sentences.length < 1) {
      return <h2>nothing to review</h2>;
    }

    const offset = this.getOffset();
    const curSentences = this.props.sentences.slice(offset, offset + PAGE_SIZE);

    return (
      <form id="add-form" onSubmit={this.onSubmit}>
        <Pager page={this.state.page} lastPage={this.getLastPage()}
               onPage={this.setPage} />

        { this.props.message && ( <p>{ this.props.message }</p> ) }

        { curSentences.map((sentence, i) => (
          <section id={`sentence-${offset + i}`} key={offset + i} className="validator">
            <div className="sentence-box">
              { sentence.sentence || sentence }
            </div>
            <div className="button-group">
              <button type="button"
                      className={`secondary ${this.state.sentences[offset + i].reviewApproval === true ? 'yes' : ''}`}
                      aria-pressed={this.state.sentences[offset + i].reviewApproval}
                      onClick={() => this.reviewSentence(offset + i, true)}
                      name={`validate-${offset + i}`}>
                👍
              </button>
              <button type="button"
                      className={`secondary ${this.state.sentences[offset + i].reviewApproval === false ? 'no' : ''}`}
                      aria-pressed={this.state.sentences[offset + i].reviewApproval === false}
                      onClick={() => this.reviewSentence(offset + i, false)}
                      name={`validate-${offset + i}`}>
                👎
              </button>
            </div>
          </section>
        )) }

        <button type="submit">Submit</button>
      </form>
    );
  }
}

const Pager = (props) => (
  <section className="pager-container">{
    [
      [0, '1'],
      [props.page - 1, '<'],
      [props.page, props.page + 1],
      [props.page + 1, '>'],
      [props.lastPage, props.lastPage + 1],
    ].map(([ page, text ]) => (
      <span>{
        (page >= 0 && page <= props.lastPage) ? (
          <button className={ props.page === page ? 'active pager' : 'pager' }
            onClick={evt => {
              evt.preventDefault();
              props.onPage && props.onPage(page);
            }} key={`page-link-${page}`}>
          {text}
          </button>
        ) : (
          <button key={`page-link-${page}`} className="active pager">{text}</button>
        )
      }</span>
    ))
  }</section>
);

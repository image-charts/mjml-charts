/**
 *
 *  mjml-chart test suite
 *
 *  Compile and run the tests:
 *    npm test
 *
 */
import { expect } from 'chai';
import mjml2html from 'mjml';
import { registerComponent } from 'mjml-core';
import ChartComponent from '../src';

const mjmlConvert = (mjml) => {
  const conversion = mjml2html(mjml)

  if (conversion.errors.length > 0) {
    throw conversion.errors
  }

  return conversion.html
}


describe('mjml-chart', () => {
  before(() => {
    registerComponent(ChartComponent);
  });

  describe('compile-time error handling', () => {
    it('should crash at compile time in case of missing (cht) required attributes', () =>
      expect(() =>
        mjmlConvert(`
          <mjml>
          <mj-body>
          <mj-chart
          chs="300x200"
          chd="t:10,20,30|15,25,35"
          chxt="x,y"
          chxl="0:|A|B|C" />
          </mj-body>
          </mjml>`)
      ).to.throw('cht is required'));

    it('should crash at compile time in case of bad formatted attributes', () =>
      expect(() => mjmlConvert(`
          <mjml>
          <mj-body>
          <mj-chart
          chs="300x200"
          chd="t:10,20,30|15,25,35"
          cht="aa"
          chxt="x,y"
          chxl="0:|A|B|C" />
          </mj-body>
        </mjml>`)
      ).to.throw(
        '"aa" is not an valid value for cht. Valid values are: ["bvs","bhs","bvg","bhg","bvo","p","p3","pc","pd","ls","lc","lxy","ls:nda","lc:nda","lxy:nda"]'
      ));

    it('should crash at compile time in case of bad attribute values', () =>
      expect(() =>
        mjmlConvert(`
          <mjml>
          <mj-body>
          <mj-chart
          chs="300x200"
          chd="INVALID_CHD_VALUE"
          cht="bvs"
          chxt="x,y"
          chxl="0:|A|B|C" />
          </mj-body>
        </mjml>`)
      ).to.throw(
        '"INVALID_CHD_VALUE" is an invalid value for chd. Examples: t:10,20,30|15,25,35'
      ));
  });

  describe('chart generation', () => {
    it('should render a mjml chart', () => {
      expect(
        mjmlConvert(`
          <mjml>
            <mj-body>
              <mj-section>
                <mj-column>
                  <mj-chart
                  chs="300x200"
                  chd="t:10,20,30|15,25,35"
                  cht="bvs"
                  chxt="x,y"
                  chxl="0:|A|B|C" />
                </mj-column>
              </mj-section>
            </mj-body>
          </mjml>`)
      ).to.contain(
        '<img\n         height="auto" src="https://image-charts.com/chart?cht=bvs&chd=t%3A10%2C20%2C30%7C15%2C25%2C35&chs=300x200&chxt=x%2Cy&chxl=0%3A%7CA%7CB%7CC" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="300"\n      />'
      );
    });

    it('should render mjml-image attributes', () => {
      const html = mjmlConvert(`
          <mjml>
            <mj-body>
              <mj-section>
                <mj-column>
                  <mj-chart
                  alt="alt"
                  align="left"
                  chs="300x200"
                  chd="t:10,20,30|15,25,35"
                  cht="bvg"
                  chxt="x,y"
                  chxl="0:|A|B|C" />
                </mj-column>
              </mj-section>
            </mj-body>
          </mjml>`)
      expect(html)
        .to.contain(`align="left"`)
        .contain(
          '<img\n         alt="alt" height="auto" src="https://image-charts.com/chart?cht=bvg&chd=t%3A10%2C20%2C30%7C15%2C25%2C35&chs=300x200&chxt=x%2Cy&chxl=0%3A%7CA%7CB%7CC" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="300"\n      />'
        );
    });
  });
});

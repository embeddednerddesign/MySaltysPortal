using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmilyEMRVS;
using EmilyEMRVS.Models;
using Microsoft.AspNetCore.Authorization;

namespace EmilyEMRVS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RequiredProductsController : ControllerBase
    {
        private readonly DataContext _context;

        public RequiredProductsController(DataContext context)
        {
            _context = context;
        }

        // // GET: api/RequiredProducts
        // [HttpGet]
        // public IEnumerable<RequiredProduct> GetRequiredProduct()
        // {
        //     return _context.RequiredProduct;
        // }

        // // GET: api/RequiredProducts/5
        // [HttpGet("{id}")]
        // public async Task<IActionResult> GetRequiredProduct([FromRoute] int id)
        // {
        //     if (!ModelState.IsValid)
        //     {
        //         return BadRequest(ModelState);
        //     }

        //     var requiredProduct = await _context.RequiredProduct.FindAsync(id);

        //     if (requiredProduct == null)
        //     {
        //         return NotFound();
        //     }

        //     return Ok(requiredProduct);
        // }

        // // PUT: api/RequiredProducts/5
        // [HttpPut("{id}")]
        // public async Task<IActionResult> PutRequiredProduct([FromRoute] int id, [FromBody] RequiredProduct requiredProduct)
        // {
        //     if (!ModelState.IsValid)
        //     {
        //         return BadRequest(ModelState);
        //     }

        //     if (id != requiredProduct.ProductId)
        //     {
        //         return BadRequest();
        //     }

        //     _context.Entry(requiredProduct).State = EntityState.Modified;

        //     try
        //     {
        //         await _context.SaveChangesAsync();
        //     }
        //     catch (DbUpdateConcurrencyException)
        //     {
        //         if (!RequiredProductExists(id))
        //         {
        //             return NotFound();
        //         }
        //         else
        //         {
        //             throw;
        //         }
        //     }

        //     return NoContent();
        // }

        // // POST: api/RequiredProducts
        // [HttpPost]
        // public async Task<IActionResult> PostRequiredProduct([FromBody] RequiredProduct requiredProduct)
        // {
        //     if (!ModelState.IsValid)
        //     {
        //         return BadRequest(ModelState);
        //     }

        //     _context.RequiredProduct.Add(requiredProduct);
        //     try
        //     {
        //         await _context.SaveChangesAsync();
        //     }
        //     catch (DbUpdateException)
        //     {
        //         if (RequiredProductExists(requiredProduct.ProductId))
        //         {
        //             return new StatusCodeResult(StatusCodes.Status409Conflict);
        //         }
        //         else
        //         {
        //             throw;
        //         }
        //     }

        //     return CreatedAtAction("GetRequiredProduct", new { id = requiredProduct.ProductId }, requiredProduct);
        // }

        // // DELETE: api/RequiredProducts/5
        // [HttpDelete("{id}")]
        // public async Task<IActionResult> DeleteRequiredProduct([FromRoute] int id)
        // {
        //     if (!ModelState.IsValid)
        //     {
        //         return BadRequest(ModelState);
        //     }

        //     var requiredProduct = await _context.RequiredProduct.FindAsync(id);
        //     if (requiredProduct == null)
        //     {
        //         return NotFound();
        //     }

        //     _context.RequiredProduct.Remove(requiredProduct);
        //     await _context.SaveChangesAsync();

        //     return Ok(requiredProduct);
        // }

        // private bool RequiredProductExists(int id)
        // {
        //     return _context.RequiredProduct.Any(e => e.ProductId == id);
        // }
    }
}